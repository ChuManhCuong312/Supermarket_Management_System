package com.supermarket.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.supermarket.management.entity.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);

    @Query("SELECT e FROM Employee e WHERE " +
            "(:name IS NULL OR LOWER(e.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:position IS NULL OR LOWER(e.position) LIKE LOWER(CONCAT('%', :position, '%'))) AND " +
            "(:phone IS NULL OR e.phone LIKE CONCAT('%', :phone, '%')) AND " +
            "(:email IS NULL OR LOWER(e.email) LIKE LOWER(CONCAT('%', :email, '%')))")
    Page<Employee> searchAdvanced(
            @Param("name") String name,
            @Param("position") String position,
            @Param("phone") String phone,
            @Param("email") String email,
            Pageable pageable);
}
