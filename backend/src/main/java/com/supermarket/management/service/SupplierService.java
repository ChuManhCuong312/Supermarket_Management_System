package com.supermarket.management.service;
import org.springframework.data.domain.Sort;
import com.supermarket.management.entity.Supplier;
import com.supermarket.management.repository.SupplierRepository;
import org.springframework.stereotype.Service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // Constructor-based Dependency Injection
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Lấy tất cả nhà cung cấp
    public Page<Supplier> getAllSuppliers(int page, int size, String sort, String sortBy) {
        String sortField = "companyName".equalsIgnoreCase(sortBy) ? "companyName" : sortBy; // hoặc validate field

        Pageable pageable;

        if ("desc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortField));
        } else if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortField));
        } else {
            pageable = PageRequest.of(page, size);
        }

        return supplierRepository.findAll(pageable);
    }

    // Validator tương tự validateCustomer
    private void validateSupplier(Supplier supplier, Supplier existingSupplier) {
        if (supplier.getCompanyName() == null || supplier.getCompanyName().isEmpty()) {
            throw new IllegalArgumentException("Tên công ty không được để trống");
        }

        if (supplier.getPhone() == null || !supplier.getPhone().matches("^0[0-9]{9}$")) {
            throw new IllegalArgumentException("SĐT phải gồm 10 số và bắt đầu bằng 0");
        }

        if (supplierRepository.existsByPhone(supplier.getPhone()) &&
                (existingSupplier == null || !existingSupplier.getPhone().equals(supplier.getPhone()))) {
            throw new IllegalArgumentException("SĐT đã tồn tại");
        }

        if (supplier.getEmail() == null || supplier.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống");
        }

        if (!supplier.getEmail().matches("^[A-Za-z0-9+_.-]+@gmail\\.com$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }

        if (supplierRepository.existsByEmail(supplier.getEmail()) &&
                (existingSupplier == null || !existingSupplier.getEmail().equals(supplier.getEmail()))) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        if (supplier.getAddress() == null || supplier.getAddress().isEmpty()) {
            throw new IllegalArgumentException("Địa chỉ không được để trống");
        }
    }

    // Thêm mới nhà cung cấp
    @Transactional
    public Supplier createSupplier(Supplier supplier) {
        trimSupplier(supplier);
        validateSupplier(supplier, null); // null vì tạo mới không có existing

        return supplierRepository.save(supplier);
    }

    // Cập nhật nhà cung cấp
    @Transactional
    public Supplier updateSupplier(Integer id, Supplier updatedSupplier) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà cung cấp với ID: " + id));

        trimSupplier(updatedSupplier);
        validateSupplier(updatedSupplier, existingSupplier);

        existingSupplier.setCompanyName(updatedSupplier.getCompanyName());
        existingSupplier.setPhone(updatedSupplier.getPhone());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setAddress(updatedSupplier.getAddress());
        existingSupplier.setContactPerson(updatedSupplier.getContactPerson());

        return supplierRepository.save(existingSupplier);
    }

    // Xóa nhà cung cấp
    @Transactional
    public void deleteSupplier(Integer id) {
        if (!supplierRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy nhà cung cấp với ID: " + id);
        }
        supplierRepository.deleteById(id);
    }

    // Tìm kiếm nâng cao với phân trang (giữ nguyên)
    public Page<Supplier> searchSuppliers(String name, String phone, String email, Pageable pageable) {
        name = (name != null) ? name.trim() : null;
        phone = (phone != null) ? phone.trim() : null;
        email = (email != null) ? email.trim() : null;

        return supplierRepository.searchByParams(
                name != null ? name : "",
                phone != null ? phone : "",
                email != null ? email : "",
                pageable != null ? pageable : PageRequest.of(0, 10)
        );
    }

    // Ví dụ hàm trim dữ liệu Supplier (tương tự trimCustomer)
    private void trimSupplier(Supplier supplier) {
        if (supplier.getCompanyName() != null) {
            supplier.setCompanyName(supplier.getCompanyName().trim());
        }
        if (supplier.getPhone() != null) {
            supplier.setPhone(supplier.getPhone().trim());
        }
        if (supplier.getEmail() != null) {
            supplier.setEmail(supplier.getEmail().trim());
        }
        if (supplier.getAddress() != null) {
            supplier.setAddress(supplier.getAddress().trim());
        }
        if (supplier.getContactPerson() != null) {
            supplier.setContactPerson(supplier.getContactPerson().trim());
        }
    }
    public List<Supplier> searchByCompanyName(String name) {
        if (name == null || name.isBlank()) {
            return Collections.emptyList();
        }
        return supplierRepository.findByCompanyNameContainingIgnoreCase(name.trim());
    }
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

}
