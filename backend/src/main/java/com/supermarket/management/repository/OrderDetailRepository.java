package com.supermarket.management.repository;

import com.supermarket.management.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    // Search by orderId or productId
    @Query("SELECT od FROM OrderDetail od " +
            "WHERE (:orderId IS NULL OR od.orderId = :orderId) " +
            "AND (:productId IS NULL OR od.productId = :productId)")
    List<OrderDetail> searchOrderDetails(
            @Param("orderId") Integer orderId,
            @Param("productId") Integer productId
    );


    List<OrderDetail> findAllByOrderByOrderIdAsc();
    List<OrderDetail> findAllByOrderByOrderIdDesc();

    List<OrderDetail> findAllByOrderByTotalPriceAsc();
    List<OrderDetail> findAllByOrderByTotalPriceDesc();
}