package com.supermarket.management.dto;

import java.math.BigDecimal;

public class EmployeePerformanceDTO {
    private Integer employeeId;
    private String employeeName;
    private String position;
    private String shift;
    private Long totalOrders;
    private BigDecimal totalRevenue;
    private BigDecimal commission;
    private Double performance;

    public EmployeePerformanceDTO() {}

    public EmployeePerformanceDTO(Integer employeeId, String employeeName, String position, String shift,
                                 Long totalOrders, BigDecimal totalRevenue, BigDecimal commission, Double performance) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.position = position;
        this.shift = shift;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.commission = commission;
        this.performance = performance;
    }

    // Getters and Setters
    public Integer getEmployeeId() { return employeeId; }
    public void setEmployeeId(Integer employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    public Long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getCommission() { return commission; }
    public void setCommission(BigDecimal commission) { this.commission = commission; }

    public Double getPerformance() { return performance; }
    public void setPerformance(Double performance) { this.performance = performance; }
}
