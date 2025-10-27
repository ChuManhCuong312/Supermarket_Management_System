package com.supermarket.management.repository;

import com.supermarket.management.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // ✅ NEW: Pagination for active orders (deletedType IS NULL)
    @Query("SELECT o FROM Order o WHERE o.deletedType IS NULL")
    Page<Order> findActiveOrders(Pageable pageable);

    // ✅ NEW: Pagination for deleted orders (deletedType IS NOT NULL)
    @Query("SELECT o FROM Order o WHERE o.deletedType IS NOT NULL")
    Page<Order> findDeletedOrders(Pageable pageable);

    // ✅ NEW: Search active orders with pagination
    @Query("SELECT o FROM Order o WHERE o.deletedType IS NULL " +
            "AND (:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:employeeId IS NULL OR o.employeeId = :employeeId) " +
            "AND (:orderDate IS NULL OR o.orderDate = :orderDate)")
    Page<Order> searchActiveOrders(
            @Param("customerId") Integer customerId,
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate,
            Pageable pageable
    );

    // ✅ NEW: Search deleted orders with pagination
    @Query("SELECT o FROM Order o WHERE o.deletedType IS NOT NULL " +
            "AND (:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:employeeId IS NULL OR o.employeeId = :employeeId) " +
            "AND (:orderDate IS NULL OR o.orderDate = :orderDate)")
    Page<Order> searchDeletedOrders(
            @Param("customerId") Integer customerId,
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate,
            Pageable pageable
    );

    // Existing search method (for backward compatibility)
    @Query("SELECT o FROM Order o WHERE " +
            "(:customerId IS NULL OR o.customerId = :customerId) " +
            "AND (:employeeId IS NULL OR o.employeeId = :employeeId) " +
            "AND (:orderDate IS NULL OR o.orderDate = :orderDate)")
    List<Order> searchOrders(
            @Param("customerId") Integer customerId,
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate
    );

    // Revenue methods
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Double getTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Long getTotalOrders(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT o.orderDate, COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate GROUP BY o.orderDate ORDER BY o.orderDate")
    List<Object[]> getDailyRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT YEAR(o.orderDate), MONTH(o.orderDate), COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) ORDER BY YEAR(o.orderDate), MONTH(o.orderDate)")
    List<Object[]> getMonthlyRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
