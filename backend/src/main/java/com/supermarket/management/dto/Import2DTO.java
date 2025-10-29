package com.supermarket.management.dto;

import java.time.LocalDate;
import java.util.List;

public class Import2DTO {
    private Integer importId;
    private LocalDate importDate;
    private Double totalAmount;
    private String note;
    private List<ImportDetail2DTO> importDetails;
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

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<ImportDetail2DTO> getImportDetails() {
        return importDetails;
    }

    public void setImportDetails(List<ImportDetail2DTO> importDetails) {
        this.importDetails = importDetails;
    }
}