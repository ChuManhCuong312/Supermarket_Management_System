package com.supermarket.management.service;

import com.supermarket.management.entity.Order;
import com.supermarket.management.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
