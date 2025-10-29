package com.supermarket.management.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "import2")
public class Import2 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "import_id")
    private Integer importId;

    @Column(name = "import_date", nullable = false)
    private LocalDate importDate;

    @Column(name = "total_amount", precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String note;

    // 🔹 Quan hệ 1 import có nhiều chi tiết nhập hàng
    @OneToMany(mappedBy = "import2", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImportDetail2> importDetails;

    // --- GETTER & SETTER ---
    public Integer getImportId() {
        return importId;
    }

    public void setImportId(Integer importId) {
        this.importId = importId;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<ImportDetail2> getImportDetails() {
        return importDetails;
    }

    public void setImportDetails(List<ImportDetail2> importDetails) {
        this.importDetails = importDetails;
    }
}

