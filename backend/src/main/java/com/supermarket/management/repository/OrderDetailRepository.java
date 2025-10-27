package com.supermarket.management.repository;

import com.supermarket.management.entity.OrderDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    List<OrderDetail> findByOrderId(Integer orderId);
    // Search by orderId or productId
    @Query("SELECT od FROM OrderDetail od " +
            "WHERE (:orderId IS NULL OR od.orderId = :orderId) " +
            "AND (:productId IS NULL OR od.productId = :productId)")
    List<OrderDetail> searchOrderDetails(
            @Param("orderId") Integer orderId,
            @Param("productId") Integer productId
    );


    List<OrderDetail> findAllByOrderByProductIdAsc();
    List<OrderDetail> findAllByOrderByProductIdDesc();

    List<OrderDetail> findAllByOrderByTotalPriceAsc();
    List<OrderDetail> findAllByOrderByTotalPriceDesc();

    Page<OrderDetail> findAll(Pageable pageable);

    @Query("SELECT od FROM OrderDetail od WHERE " +
            "(:orderId IS NULL OR od.orderId = :orderId) AND " +
            "(:productId IS NULL OR od.productId = :productId)")
    Page<OrderDetail> findByCriteria(
            @Param("orderId") Integer orderId,
            @Param("productId") Integer productId,
            Pageable pageable
    );

    // Revenue methods
    @Query("SELECT p.name, COALESCE(SUM(od.totalPrice), 0) FROM OrderDetail od " +
            "JOIN Product p ON od.productId = p.productId " +
            "JOIN Order o ON od.orderId = o.orderId " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.productId, p.name " +
            "ORDER BY SUM(od.totalPrice) DESC")
    List<Object[]> getTopProductsByRevenue(@Param("startDate") java.time.LocalDate startDate, @Param("endDate") java.time.LocalDate endDate);

    @Query("SELECT p.name, COALESCE(SUM(od.quantity), 0) FROM OrderDetail od " +
            "JOIN Product p ON od.productId = p.productId " +
            "JOIN Order o ON od.orderId = o.orderId " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.productId, p.name " +
            "ORDER BY SUM(od.quantity) DESC")
    List<Object[]> getTopProductsByQuantity(@Param("startDate") java.time.LocalDate startDate, @Param("endDate") java.time.LocalDate endDate);

    @Query("SELECT p.category, COALESCE(SUM(od.totalPrice), 0) FROM OrderDetail od " +
            "JOIN Product p ON od.productId = p.productId " +
            "JOIN Order o ON od.orderId = o.orderId " +
            "WHERE o.orderDate BETWEEN :startDate AND :endDate " +
            "GROUP BY p.category " +
            "ORDER BY SUM(od.totalPrice) DESC")
    List<Object[]> getRevenueByCategory(@Param("startDate") java.time.LocalDate startDate, @Param("endDate") java.time.LocalDate endDate);
}
