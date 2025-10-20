package com.supermarket.management.repository;

import com.supermarket.management.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
    // Bạn có thể thêm các method tìm kiếm tùy chỉnh ở đây nếu cần
}
