package com.supermarket.management.repository;


import com.supermarket.management.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    boolean existsByPhone(String phone);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM Customer c WHERE " +
            "(:name IS NULL OR c.name LIKE %:name%) AND " +
            "(:phone IS NULL OR c.phone = :phone) AND " +
            "(:email IS NULL OR c.email LIKE %:email%) AND " +
            "(:membershipType IS NULL OR c.membershipType = :membershipType)")
    List<Customer> searchAdvanced(@Param("name") String name,
                                  @Param("phone") String phone,
                                  @Param("email") String email,
                                  @Param("membershipType") String membershipType);
}
