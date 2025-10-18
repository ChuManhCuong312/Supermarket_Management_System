package com.supermarket.management.service;

import com.supermarket.management.dto.OrderRequest;
import com.supermarket.management.dto.OrderUpdateRequest;
import com.supermarket.management.entity.Order;
import com.supermarket.management.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setCustomerId(request.getCustomerId());
        order.setEmployeeId(request.getEmployeeId());
        order.setOrderDate(request.getOrderDate());
        order.setTotalAmount(request.getTotalAmount() != null ? request.getTotalAmount() : BigDecimal.ZERO);
        order.setDiscount(request.getDiscount() != null ? request.getDiscount() : BigDecimal.ZERO);

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
}
