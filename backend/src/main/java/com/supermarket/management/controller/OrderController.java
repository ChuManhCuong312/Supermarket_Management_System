package com.supermarket.management.controller;

import  com.supermarket.management.entity.Order;
import com.supermarket.management.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // allow frontend connection
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // Sorted: use query param 'sort=asc' or 'sort=desc'
    @GetMapping("/sorted/buydate")
    public List<Order> getAllOrdersSortedByDate(@RequestParam(defaultValue = "asc") String sort) {
        if (sort.equalsIgnoreCase("desc")) {
            return orderService.getOrdersSortedByDateDesc();
        }
        return orderService.getOrdersSortedByDateAsc();
    }

    // Sorted: use query param 'sort=asc' or 'sort=desc'
    @GetMapping("/sorted/totalamount")
    public List<Order> getAllOrdersSortedByTotalAmount(@RequestParam(defaultValue = "asc") String sort) {
        if (sort.equalsIgnoreCase("desc")) {
            return orderService.getOrdersSortedByTotalDesc();
        }
        return orderService.getOrdersSortedByTotalAsc();
    }
}
