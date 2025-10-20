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

    // Thêm mới nhà cung cấp
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // Cập nhật nhà cung cấp
    public Supplier updateSupplier(Integer id, Supplier updatedSupplier) {
        return supplierRepository.findById(id)
                .map(supplier -> {
                    supplier.setCompanyName(updatedSupplier.getCompanyName());
                    supplier.setPhone(updatedSupplier.getPhone());
                    supplier.setEmail(updatedSupplier.getEmail());
                    supplier.setAddress(updatedSupplier.getAddress());
                    supplier.setContactPerson(updatedSupplier.getContactPerson());
                    return supplierRepository.save(supplier);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhà cung cấp với ID: " + id));
    }

    // Xóa nhà cung cấp
    public void deleteSupplier(Integer id) {
        if (!supplierRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy nhà cung cấp với ID: " + id );
        }

        supplierRepository.deleteById(id);
    }

    public List<Supplier> searchSuppliers(String keyword) {
        return supplierRepository.searchByKeyword(keyword);
    }
}
