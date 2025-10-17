package com.supermarket.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.supermarket.management.entity.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);


    @Query("SELECT e FROM Employee e WHERE " +
            "(:name IS NULL OR e.name LIKE %:name%) AND " +
            "(:position IS NULL OR e.position LIKE %:position%) AND " +
            "(:phone IS NULL OR e.phone LIKE %:phone%) AND " +
            "(:email IS NULL OR e.email LIKE %:email%)")
    List<Employee> searchAdvanced(
            @Param("name") String name,
            @Param("position") String position,
            @Param("phone") String phone,
            @Param("email") String email
    );
}
