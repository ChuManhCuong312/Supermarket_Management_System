package com.supermarket.management.dto;

import java.math.BigDecimal;

/**
 * DTO cho doanh thu theo sản phẩm
 */
public class ProductRevenueDTO {
    private Integer productId;
    private String productName;
    private String barcode;
    private String category;
    private Integer quantitySold;
    private BigDecimal revenue;
    private BigDecimal averagePrice;

    public ProductRevenueDTO() {
    }

    public ProductRevenueDTO(Integer productId, String productName, String barcode, 
                            String category, Integer quantitySold, BigDecimal revenue, 
                            BigDecimal averagePrice) {
        this.productId = productId;
        this.productName = productName;
        this.barcode = barcode;
        this.category = category;
        this.quantitySold = quantitySold;
        this.revenue = revenue;
        this.averagePrice = averagePrice;
    }

    // Getters and Setters
    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getQuantitySold() {
        return quantitySold;
    }

    public void setQuantitySold(Integer quantitySold) {
        this.quantitySold = quantitySold;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }
}

