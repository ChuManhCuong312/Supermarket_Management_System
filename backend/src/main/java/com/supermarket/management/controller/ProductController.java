package com.supermarket.management.controller;

import com.supermarket.management.entity.Product;
import com.supermarket.management.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    // Constructor-based Dependency Injection
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. Lấy tất cả sản phẩm
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

}
