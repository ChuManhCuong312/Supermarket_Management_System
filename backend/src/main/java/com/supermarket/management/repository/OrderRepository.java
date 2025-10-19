package com.supermarket.management.repository;

import com.supermarket.management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Fetch all orders sorted by order date
    List<Order> findAllByOrderByOrderDateAsc(); // ascending order
    List<Order> findAllByOrderByOrderDateDesc(); // descending order

    // Fetch all orders sorted by total amount
    List<Order> findAllByOrderByTotalAmountAsc();
    List<Order> findAllByOrderByTotalAmountDesc();
}