package com.example.demo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "import")
public class Import {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "import_id")
    private Integer importId;

    @Column(name = "supplier_id")
    private Integer supplierId;

    @Column(name = "import_date", nullable = false)
    private LocalDate importDate;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

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
