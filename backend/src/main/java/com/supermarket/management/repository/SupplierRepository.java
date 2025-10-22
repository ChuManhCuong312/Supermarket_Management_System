package com.supermarket.management.repository;

import com.supermarket.management.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("SELECT s FROM Supplier s " +
            "WHERE LOWER(s.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR s.phone LIKE CONCAT('%', :keyword, '%')")
    List<Supplier> searchByKeyword(@Param("keyword") String keyword);
}
