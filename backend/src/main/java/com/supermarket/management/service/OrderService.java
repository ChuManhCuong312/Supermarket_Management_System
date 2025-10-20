package com.supermarket.management.service;

import com.supermarket.management.dto.OrderRequest;
import com.supermarket.management.dto.OrderUpdateRequest;
import com.supermarket.management.entity.Order;
import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.OrderDetailRepository;
import com.supermarket.management.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersSortedByDateAsc() {
        return orderRepository.findAllByOrderByOrderDateAsc();
    }

    public List<Order> getOrdersSortedByDateDesc() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public List<Order> getOrdersSortedByTotalAsc() {return orderRepository.findAllByOrderByTotalAmountAsc();}

    public List<Order> getOrdersSortedByTotalDesc() {return orderRepository.findAllByOrderByTotalAmountDesc();}

    @Transactional
    public Order createOrder(Order order) {
        // Validate required fields
        if (order.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (order.getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        // Set order date to today if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }

        // Force total_amount = 0 at creation
        order.setTotalAmount(BigDecimal.ZERO);

        // Default discount = 0 if not provided
        if (order.getDiscount() == null) {
            order.setDiscount(BigDecimal.ZERO);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Integer orderId, Order updatedOrder) {
        // Find existing order
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Update editable fields
        if (updatedOrder.getCustomerId() != null) {
            existingOrder.setCustomerId(updatedOrder.getCustomerId());
        }
        if (updatedOrder.getEmployeeId() != null) {
            existingOrder.setEmployeeId(updatedOrder.getEmployeeId());
        }
        if (updatedOrder.getOrderDate() != null) {
            existingOrder.setOrderDate(updatedOrder.getOrderDate());
        }
        if (updatedOrder.getDiscount() != null) {
            existingOrder.setDiscount(updatedOrder.getDiscount());
        }

        // Recalculate total amount from order details
        BigDecimal recalculatedTotal = orderDetailRepository.findAll().stream()
                .filter(od -> od.getOrderId().equals(orderId))
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount if any
        if (existingOrder.getDiscount() != null && existingOrder.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = existingOrder.getDiscount().divide(BigDecimal.valueOf(100));
            recalculatedTotal = recalculatedTotal.subtract(recalculatedTotal.multiply(discountRate));
        }

        existingOrder.setTotalAmount(recalculatedTotal);

        // Save and return
        return orderRepository.save(existingOrder);
    }

    public List<Order> searchOrders(Integer customerId, Integer employeeId, LocalDate orderDate) {
        return orderRepository.searchOrders(customerId, employeeId, orderDate);
    }
}
