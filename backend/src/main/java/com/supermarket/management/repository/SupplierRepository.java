package com.supermarket.management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import com.supermarket.management.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    @Query("SELECT s FROM Supplier s " +
            "WHERE (:name IS NULL OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:phone IS NULL OR s.phone LIKE CONCAT('%', :phone, '%')) " +
            "AND (:email IS NULL OR LOWER(s.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<Supplier> searchByParams(@Param("name") String name,
                                  @Param("phone") String phone,
                                  @Param("email") String email,
                                  Pageable pageable);

    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);
}