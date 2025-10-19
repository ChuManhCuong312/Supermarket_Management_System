package com.supermarket.management.repository;

import com.supermarket.management.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findAllByOrderByOrderIdAsc();
    List<OrderDetail> findAllByOrderByOrderIdDesc();

    List<OrderDetail> findAllByOrderByTotalPriceAsc();
    List<OrderDetail> findAllByOrderByTotalPriceDesc();
}