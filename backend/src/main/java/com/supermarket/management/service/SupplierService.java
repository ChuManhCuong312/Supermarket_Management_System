package com.supermarket.management.service;

import com.supermarket.management.entity.Supplier;
import com.supermarket.management.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // Constructor-based Dependency Injection
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Lấy tất cả nhà cung cấp
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

}
