package com.supermarket.management.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

import com.supermarket.management.entity.Supplier;
import com.supermarket.management.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import com.supermarket.management.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    // Constructor Injection
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // GET /api/suppliers
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllSuppliers(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "none") String sort,
            @RequestParam(required = false, defaultValue = "companyName") String sortBy) {

        int pageIndex = page - 1; // vì Pageable bắt đầu từ 0
        Page<Supplier> supplierPage = supplierService.getAllSuppliers(pageIndex, size, sort, sortBy);

        Map<String, Object> response = new HashMap<>();
        response.put("data", supplierPage.getContent());
        response.put("currentPage", supplierPage.getNumber());
        response.put("totalItems", supplierPage.getTotalElements());
        response.put("totalPages", supplierPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // POST /api/suppliers
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier) {
        try {
            Supplier saved = supplierService.createSupplier(supplier);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // PUT /api/suppliers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Integer id, @RequestBody Supplier supplier) {
        Supplier updated = supplierService.updateSupplier(id, supplier);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/suppliers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Integer id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH /api/suppliers/search
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchSuppliers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "none") String sort,
            @RequestParam(defaultValue = "name") String sortBy) {

        int pageIndex = page - 1;
        Pageable pageable;

        if ("desc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, sortBy));
        } else if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.ASC, sortBy));
        } else {
            pageable = PageRequest.of(pageIndex, size);
        }

        Page<Supplier> results = supplierService.searchSuppliers(name, phone, email, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", results.getContent());
        response.put("currentPage", results.getNumber() + 1); // trả về 1-based index
        response.put("totalItems", results.getTotalElements());
        response.put("totalPages", results.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // Tìm item theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSupplierById(@PathVariable Integer id) {
        try {
            Supplier supplier = supplierService.getSupplierById(id);
            return ResponseEntity.ok(supplier);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

}
