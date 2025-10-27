package com.supermarket.management.repository;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    @Query("SELECT p FROM Product p " +
            "WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:barcode IS NULL OR p.barcode LIKE CONCAT('%', :barcode, '%')) " +
            "AND (:category IS NULL OR LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))) " +
            "AND (:supplier IS NULL OR LOWER(p.supplier.companyName) LIKE LOWER(CONCAT('%', :supplier, '%')))")
    Page<Product> searchByParams(@Param("name") String name,
                                 @Param("barcode") String barcode,
                                 @Param("category") String category,
                                 @Param("supplier") String supplier,
                                 Pageable pageable);

    boolean existsByBarcode(String barcode);
    List<Product> findByCategoryContainingIgnoreCase(String category);
    List<Product> findByNameContainingIgnoreCase(String name);
}