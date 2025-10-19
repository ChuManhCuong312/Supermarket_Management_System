package com.supermarket.management.repository;

import com.supermarket.management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    @Query("SELECT o FROM Order o " +
            "WHERE (:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:employeeId IS NULL OR o.employeeId = :employeeId) " +
            "AND (:orderDate IS NULL OR o.orderDate = :orderDate)")
    List<Order> searchOrders(
            @Param("customerId") Integer customerId,
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate
    );

    // Fetch all orders sorted by order date
    List<Order> findAllByOrderByOrderDateAsc(); // ascending order
    List<Order> findAllByOrderByOrderDateDesc(); // descending order

    // Fetch all orders sorted by total amount
    List<Order> findAllByOrderByTotalAmountAsc();
    List<Order> findAllByOrderByTotalAmountDesc();
}