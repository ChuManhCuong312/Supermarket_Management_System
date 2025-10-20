package com.supermarket.management.controller;

import com.supermarket.management.entity.Supplier;
import com.supermarket.management.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    // Constructor Injection
    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    // GET /api/suppliers
    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

}
