package com.supermarket.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "import")
public class Import {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "import_id")
    private Integer importId;

    @NotNull(message = "Nhà cung cấp không được để trống")
    @JsonProperty("supplier_id")
    @Column(name = "supplier_id")
    private Integer supplierId;

    @NotNull(message = "Ngày nhập hàng không được để trống")
    @Column(name = "import_date", nullable = false)
    @JsonProperty("import_date")
    private LocalDate importDate;

    @DecimalMin(value = "0.0", inclusive = true, message = "Tổng tiền không được âm")
    @Column(name = "total_amount", precision = 12, scale = 2)
    @JsonProperty("total_amount")
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Size(max = 50, message = "Trạng thái không được vượt quá 50 ký tự")
    @Column(name = "status", length = 50)
    private String status = "Pending";

    @Column(columnDefinition = "TEXT")
    private String note;

    // --- Getters & Setters ---
    public Integer getImportId() {
        return importId;
    }

    public void setImportId(Integer importId) {
        this.importId = importId;
    }

    public Integer getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Integer supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getImportDate() {
        return importDate;
    }

    public void setImportDate(LocalDate importDate) {
        this.importDate = importDate;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
