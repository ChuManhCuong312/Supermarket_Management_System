package com.supermarket.management.controller;

import com.supermarket.management.dto.ProductRequest;
import com.supermarket.management.entity.Product;
import com.supermarket.management.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    // Constructor-based Dependency Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET /api/products
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "none") String sort,
            @RequestParam(required = false, defaultValue = "name") String sortBy) {

        int pageIndex = page - 1;
        Page<Product> productPage = productService.getAllProducts(pageIndex, size, sort, sortBy);

        Map<String, Object> response = new HashMap<>();
        response.put("data", productPage.getContent());
        response.put("currentPage", productPage.getNumber() + 1); // chuyển về 1-based
        response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Integer id) {
        try {
            Product product = productService.getProductById(id);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        try {
            Product created = productService.createProduct(request);
            return ResponseEntity.ok(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Integer id, @RequestBody ProductRequest request) {
        Product updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // SEARCH /api/products/search
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String barcode,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String supplier,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "none") String sort,
            @RequestParam(defaultValue = "name") String sortBy) {

        int pageIndex = page - 1; // PageRequest dùng 0-based
        Pageable pageable;

        // Sắp xếp theo tham số sort
        if ("desc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.DESC, sortBy));
        } else if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(pageIndex, size, Sort.by(Sort.Direction.ASC, sortBy));
        } else {
            pageable = PageRequest.of(pageIndex, size);
        }

        Page<Product> results = productService.searchProducts(name, barcode, category, supplier, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("data", results.getContent());
        response.put("currentPage", results.getNumber() + 1); // trả về 1-based
        response.put("totalItems", results.getTotalElements());
        response.put("totalPages", results.getTotalPages());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/categorysearch")
    public ResponseEntity<List<String>> searchCategories(
            @RequestParam(required = false) String category) {

        List<String> categories = productService.searchCategories(category);
        return ResponseEntity.ok(categories);
    }

}
