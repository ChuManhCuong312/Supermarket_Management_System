package com.supermarket.management.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supermarket.management.dto.CategoryRevenueDTO;
import com.supermarket.management.dto.DailyRevenueDTO;
import com.supermarket.management.dto.EmployeePerformanceDTO;
import com.supermarket.management.dto.MonthlyRevenueDTO;
import com.supermarket.management.dto.ProductRevenueDTO;
import com.supermarket.management.dto.RevenueResponse;
import com.supermarket.management.service.RevenueService;

@RestController
@RequestMapping("/api/revenue")
@CrossOrigin(origins = "*")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    /**
     * Lấy tổng doanh thu và số đơn hàng
     * GET /api/revenue/total?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/total")
    public ResponseEntity<RevenueResponse> getTotalRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        RevenueResponse response = revenueService.getTotalRevenue(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy doanh thu theo ngày
     * GET /api/revenue/daily?startDate=2024-01-01&endDate=2024-01-31
     */
    @GetMapping("/daily")
    public ResponseEntity<List<DailyRevenueDTO>> getDailyRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<DailyRevenueDTO> response = revenueService.getDailyRevenue(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy doanh thu theo tháng
     * GET /api/revenue/monthly?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyRevenueDTO>> getMonthlyRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<MonthlyRevenueDTO> response = revenueService.getMonthlyRevenue(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy top sản phẩm bán chạy theo doanh thu
     * GET /api/revenue/products/top-by-revenue?startDate=2024-01-01&endDate=2024-12-31&limit=10
     */
    @GetMapping("/products/top-by-revenue")
    public ResponseEntity<List<ProductRevenueDTO>> getTopProductsByRevenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer limit
    ) {
        List<ProductRevenueDTO> response = revenueService.getTopProductsByRevenue(startDate, endDate, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy top sản phẩm bán chạy theo số lượng
     * GET /api/revenue/products/top-by-quantity?startDate=2024-01-01&endDate=2024-12-31&limit=10
     */
    @GetMapping("/products/top-by-quantity")
    public ResponseEntity<List<ProductRevenueDTO>> getTopProductsByQuantity(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Integer limit
    ) {
        List<ProductRevenueDTO> response = revenueService.getTopProductsByQuantity(startDate, endDate, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy doanh thu theo danh mục sản phẩm
     * GET /api/revenue/categories?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryRevenueDTO>> getRevenueByCategory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<CategoryRevenueDTO> response = revenueService.getRevenueByCategory(startDate, endDate);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy báo cáo hiệu suất nhân viên
     * GET /api/revenue/employees?startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeePerformanceDTO>> getEmployeePerformance(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<EmployeePerformanceDTO> response = revenueService.getEmployeePerformance(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}

