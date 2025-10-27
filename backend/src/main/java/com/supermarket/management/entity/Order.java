package com.supermarket.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @NotNull(message = "Mã khách hàng không được để trống")
    @Min(value = 1, message = "Mã khách hàng phải lớn hơn 0")
    @Column(name = "customer_id")
    private Integer customerId;

    @NotNull(message = "Mã nhân viên không được để trống")
    @Min(value = 1, message = "Mã nhân viên phải lớn hơn 0")
    @Column(name = "employee_id")
    private Integer employeeId;

    @NotNull(message = "Ngày đặt hàng không được để trống")
    @PastOrPresent(message = "Ngày đặt hàng không thể ở tương lai")
    @Column(name = "order_date",nullable = false)
    private LocalDate orderDate;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @DecimalMin(value = "0.00", message = "Giảm giá không thể âm")
    @Digits(integer = 5, fraction = 2, message = "Định dạng giảm giá không hợp lệ")
    @Column(name = "discount",nullable = true)
    private BigDecimal discount;

    @Column(name = "deleted_type",length = 50)
    private String deletedType;

    //Getters and Setters
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    // Getters and setters
    public String getDeletedType() { return deletedType; }
    public void setDeletedType(String deletedType) { this.deletedType = deletedType; }
}