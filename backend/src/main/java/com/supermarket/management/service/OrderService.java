package com.supermarket.management.service;

import com.supermarket.management.dto.OrderRequest;
import com.supermarket.management.dto.OrderUpdateRequest;
import com.supermarket.management.entity.Order;
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
    public Order updateOrderAmountAndDiscount(Integer orderId, OrderUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (request.getTotalAmount() != null) {
            order.setTotalAmount(request.getTotalAmount());
        }
        if (request.getDiscount() != null) {
            order.setDiscount(request.getDiscount());
        }

        return orderRepository.save(order);
    }

    public List<Order> searchOrders(Integer customerId, Integer employeeId, LocalDate orderDate) {
        return orderRepository.searchOrders(customerId, employeeId, orderDate);
    }
}
