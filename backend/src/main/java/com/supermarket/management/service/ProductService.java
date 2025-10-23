package com.supermarket.management.service;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    // Constructor-based Dependency Injection
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Lấy tất cả sản phẩm
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Search Product by ID
    public Product getProductById(Integer id) {
        return productRepository.findById(id) // <-- use instance, not class
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    // Thêm sản phẩm mới
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    public Product updateProduct(Integer id, Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setBarcode(updatedProduct.getBarcode());
                    product.setCategory(updatedProduct.getCategory());
                    product.setPrice(updatedProduct.getPrice());
                    product.setStock(updatedProduct.getStock());
                    product.setSupplier(updatedProduct.getSupplier());
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + id);
        }

        productRepository.deleteById(id);
    }
}
