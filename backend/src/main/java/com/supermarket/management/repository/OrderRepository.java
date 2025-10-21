package com.supermarket.management.repository;

import com.supermarket.management.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // Active orders
    List<Order> findByDeletedTypeIsNull();

    // Orders by deleted type
    List<Order> findByDeletedType(String deletedType);

    // Fetch active order by ID
    Optional<Order> findByOrderIdAndDeletedTypeIsNull(Integer orderId);

    // Search only active orders by customer, employee, or orderDate
    @Query("SELECT o FROM Order o " +
            "WHERE o.deletedType IS NULL " +
            "AND (:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:employeeId IS NULL OR o.employeeId = :employeeId) " +
            "AND (:orderDate IS NULL OR o.orderDate = :orderDate)")
    List<Order> searchActiveOrders(
            @Param("customerId") Integer customerId,
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate
    );


    // Active orders sorted by date
    List<Order> findByDeletedTypeIsNullOrderByOrderDateAsc();
    List<Order> findByDeletedTypeIsNullOrderByOrderDateDesc();

    // Active orders sorted by total amount
    List<Order> findByDeletedTypeIsNullOrderByTotalAmountAsc();
    List<Order> findByDeletedTypeIsNullOrderByTotalAmountDesc();
}