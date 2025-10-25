package com.supermarket.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String barcode;

    @Column(length = 50)
    private String category;

    @DecimalMin(value = "0.0", inclusive = true, message = "Giá sản phẩm không thể âm")
    @Digits(integer = 10, fraction = 2)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Min(value = 0, message = "Số lượng tồn kho không thể âm")
    @Column(nullable = false)
    private Integer stock = 0;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "supplier_id", foreignKey = @ForeignKey(name = "fk_product_supplier_id"))
    private Supplier supplier;

    // Getters and Setters
    public Integer getProductId() {return productId;}
    public void setProductId(Integer productId) {this.productId = productId;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public String getBarcode() {return barcode;}
    public void setBarcode(String barcode) {this.barcode = barcode;}
    public String getCategory() {return category;}
    public void setCategory(String category) {this.category = category;}
    public BigDecimal getPrice() {return price;}
    public void setPrice(BigDecimal price) {this.price = price;}
    public Integer getStock() {return stock;}
    public void setStock(Integer stock) {this.stock = stock;}
    public Supplier getSupplier() {return supplier;}
    public void setSupplier(Supplier supplier) {this.supplier = supplier;}

}
