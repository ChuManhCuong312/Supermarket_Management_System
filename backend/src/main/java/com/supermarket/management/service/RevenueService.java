package com.supermarket.management.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.supermarket.management.dto.CategoryRevenueDTO;
import com.supermarket.management.dto.DailyRevenueDTO;
import com.supermarket.management.dto.MonthlyRevenueDTO;
import com.supermarket.management.dto.ProductRevenueDTO;
import com.supermarket.management.dto.RevenueResponse;
import com.supermarket.management.repository.OrderDetailRepository;
import com.supermarket.management.repository.OrderRepository;

@Service
public class RevenueService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    /**
     * Lấy tổng doanh thu trong khoảng thời gian
     */
    public RevenueResponse getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        Double totalRevenueDouble = orderRepository.getTotalRevenue(startDate, endDate);
        BigDecimal totalRevenue = totalRevenueDouble != null ? BigDecimal.valueOf(totalRevenueDouble) : BigDecimal.ZERO;
        Long totalOrders = orderRepository.getTotalOrders(startDate, endDate);
        
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (totalOrders != null && totalOrders > 0 && totalRevenue != null) {
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP);
        }

        return new RevenueResponse(
            totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
            totalOrders != null ? totalOrders : 0L,
            averageOrderValue,
            startDate,
            endDate
        );
    }

    /**
     * Lấy doanh thu theo ngày
     */
    public List<DailyRevenueDTO> getDailyRevenue(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = orderRepository.getDailyRevenue(startDate, endDate);
        List<DailyRevenueDTO> dailyRevenueList = new ArrayList<>();

        for (Object[] result : results) {
            LocalDate date = (LocalDate) result[0];
            BigDecimal revenue = (BigDecimal) result[1];
            Long orderCount = (Long) result[2];

            dailyRevenueList.add(new DailyRevenueDTO(date, revenue, orderCount));
        }

        return dailyRevenueList;
    }

    /**
     * Lấy doanh thu theo tháng
     */
    public List<MonthlyRevenueDTO> getMonthlyRevenue(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = orderRepository.getMonthlyRevenue(startDate, endDate);
        List<MonthlyRevenueDTO> monthlyRevenueList = new ArrayList<>();

        for (Object[] result : results) {
            Integer year = (Integer) result[0];
            Integer monthNumber = (Integer) result[1];
            BigDecimal revenue = (BigDecimal) result[2];
            Long orderCount = (Long) result[3];

            String monthName = getMonthName(monthNumber);

            monthlyRevenueList.add(new MonthlyRevenueDTO(monthName, year, monthNumber, revenue, orderCount));
        }

        return monthlyRevenueList;
    }

    /**
     * Lấy top sản phẩm bán chạy theo doanh thu
     */
    public List<ProductRevenueDTO> getTopProductsByRevenue(LocalDate startDate, LocalDate endDate, Integer limit) {
        List<Object[]> results = orderDetailRepository.getTopProductsByRevenue(startDate, endDate);
        List<ProductRevenueDTO> productRevenueList = new ArrayList<>();

        int count = 0;
        for (Object[] result : results) {
            if (limit != null && count >= limit) break;

            Integer productId = (Integer) result[0];
            String productName = (String) result[1];
            String barcode = (String) result[2];
            String category = (String) result[3];
            Long quantitySold = (Long) result[4];
            BigDecimal revenue = (BigDecimal) result[5];
            BigDecimal averagePrice = (BigDecimal) result[6];

            productRevenueList.add(new ProductRevenueDTO(
                productId,
                productName,
                barcode,
                category,
                quantitySold != null ? quantitySold.intValue() : 0,
                revenue,
                averagePrice
            ));

            count++;
        }

        return productRevenueList;
    }

    /**
     * Lấy top sản phẩm bán chạy theo số lượng
     */
    public List<ProductRevenueDTO> getTopProductsByQuantity(LocalDate startDate, LocalDate endDate, Integer limit) {
        List<Object[]> results = orderDetailRepository.getTopProductsByQuantity(startDate, endDate);
        List<ProductRevenueDTO> productRevenueList = new ArrayList<>();

        int count = 0;
        for (Object[] result : results) {
            if (limit != null && count >= limit) break;

            Integer productId = (Integer) result[0];
            String productName = (String) result[1];
            String barcode = (String) result[2];
            String category = (String) result[3];
            Long quantitySold = (Long) result[4];
            BigDecimal revenue = (BigDecimal) result[5];
            BigDecimal averagePrice = (BigDecimal) result[6];

            productRevenueList.add(new ProductRevenueDTO(
                productId,
                productName,
                barcode,
                category,
                quantitySold != null ? quantitySold.intValue() : 0,
                revenue,
                averagePrice
            ));

            count++;
        }

        return productRevenueList;
    }

    /**
     * Lấy doanh thu theo danh mục sản phẩm
     */
    public List<CategoryRevenueDTO> getRevenueByCategory(LocalDate startDate, LocalDate endDate) {
        List<Object[]> results = orderDetailRepository.getRevenueByCategory(startDate, endDate);
        List<CategoryRevenueDTO> categoryRevenueList = new ArrayList<>();

        for (Object[] result : results) {
            String category = (String) result[0];
            BigDecimal revenue = (BigDecimal) result[1];
            Long quantitySold = (Long) result[2];
            Long orderCount = (Long) result[3];

            categoryRevenueList.add(new CategoryRevenueDTO(
                category,
                revenue,
                quantitySold != null ? quantitySold.intValue() : 0,
                orderCount
            ));
        }

        return categoryRevenueList;
    }

    /**
     * Helper method to get month name
     */
    private String getMonthName(Integer monthNumber) {
        String[] months = {
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        };
        return months[monthNumber - 1];
    }
}

