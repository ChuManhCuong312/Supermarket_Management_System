package com.supermarket.management.repository;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
}