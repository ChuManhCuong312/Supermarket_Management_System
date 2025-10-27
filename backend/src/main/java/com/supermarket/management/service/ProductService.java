package com.supermarket.management.service;

import com.supermarket.management.dto.ProductRequest;
import com.supermarket.management.entity.Product;
import com.supermarket.management.entity.Supplier;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.ProductRepository;
import com.supermarket.management.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    // Constructor-based Dependency Injection
    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    // Lấy tất cả sản phẩm
    public Page<Product> getAllProducts(int page, int size, String sort, String sortBy) {
        String sortField;
        switch (sortBy.toLowerCase()) {
            case "price":
                sortField = "price";
                break;
            case "stock":
                sortField = "stock";
                break;
            default:
                sortField = "name"; // mặc định
        }

        Pageable pageable;

        if ("desc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortField));
        } else if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortField));
        } else {
            pageable = PageRequest.of(page, size);
        }

        return productRepository.findAll(pageable);
    }

    // Search Product by ID
    public Product getProductById(Integer id) {
        return productRepository.findById(id) // <-- use instance, not class
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
    }

    @Transactional
    public Product createProduct(ProductRequest request) {
        if (request.getSupplierId() == null) {
            throw new IllegalArgumentException("Nhà cung cấp không tồn tại");
        }
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Nhà cung cấp không tồn tại"));

        Product product = new Product();
        product.setName(request.getName());
        product.setBarcode(request.getBarcode());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setSupplier(supplier);

        validateProduct(product,null);

        return productRepository.save(product);
    }


    @Transactional
    public Product updateProduct(Integer id, ProductRequest request) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + id));

        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new IllegalArgumentException("Nhà cung cấp không được trống"));

        existingProduct.setName(request.getName());
        existingProduct.setBarcode(request.getBarcode());
        existingProduct.setCategory(request.getCategory());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setStock(request.getStock());
        existingProduct.setSupplier(supplier);

        validateProduct(existingProduct, existingProduct);

        return productRepository.save(existingProduct);
    }


    //  Xóa sản phẩm

    @Transactional
    public void deleteProduct(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm với ID: " + id);
        }
        productRepository.deleteById(id);
    }

    //  Tìm kiếm sản phẩm nâng cao
    public Page<Product> searchProducts(String name, String barcode, String category, String supplier, Pageable pageable) {
        name = (name != null) ? name.trim() : null;
        barcode = (barcode != null) ? barcode.trim() : null;
        category = (category != null) ? category.trim() : null;
        supplier = (supplier != null) ? supplier.trim() : null;

        return productRepository.searchByParams(
                name != null ? name : "",
                barcode != null ? barcode : "",
                category != null ? category : "",
                supplier != null ? supplier : "",
                pageable != null ? pageable : PageRequest.of(0, 10)
        );
    }

    private void validateProduct(Product product, Product existingProduct) {
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }

        if (product.getBarcode() == null || product.getBarcode().trim().isEmpty()) {
            throw new IllegalArgumentException("Mã vạch không được để trống");
        }

        if (!product.getBarcode().matches("^[0-9]{8,13}$")) {
            throw new IllegalArgumentException("Mã vạch phải gồm 8–13 chữ số");
        }

        if (productRepository.existsByBarcode(product.getBarcode()) &&
                (existingProduct == null || !existingProduct.getBarcode().equals(product.getBarcode()))) {
            throw new IllegalArgumentException("Mã vạch đã tồn tại");
        }

        if (product.getCategory() == null || product.getCategory().trim().isEmpty()) {
            throw new IllegalArgumentException("Loại sản phẩm không được để trống");
        }

        if (product.getSupplier() == null) {
            throw new IllegalArgumentException("Nhà cung cấp không được để trống");
        }

        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ (phải ≥ 0)");
        }

        if (product.getStock() < 0) {
            throw new IllegalArgumentException("Số lượng tồn kho không hợp lệ (phải ≥ 0)");
        }
    }
    public List<String> searchCategories(String category) {
        List<Product> products;
        if (category == null || category.isBlank()) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByCategoryContainingIgnoreCase(category.trim());
        }

        // Lấy tất cả category và loại bỏ trùng lặp
        return products.stream()
                .map(Product::getCategory)
                .filter(c -> c != null && !c.isBlank())
                .distinct()
                .toList();
    }
    public List<Map<String, Object>> searchProductNames(String name) {
        List<Product> products;

        if (name == null || name.isBlank()) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByNameContainingIgnoreCase(name.trim());
        }

        // Trả về danh sách gồm id + name, loại bỏ trùng tên
        return products.stream()
                .filter(p -> p.getName() != null && !p.getName().isBlank())
                .collect(Collectors.toMap(
                        Product::getName, // key là tên để loại trùng
                        p -> {
                            Map<String, Object> map = new HashMap<>();
                            map.put("productId", p.getProductId());
                            map.put("name", p.getName());
                            return map;
                        },
                        (existing, replacement) -> existing // giữ lại bản đầu tiên nếu trùng tên
                ))
                .values()
                .stream()
                .toList();
    }



}
