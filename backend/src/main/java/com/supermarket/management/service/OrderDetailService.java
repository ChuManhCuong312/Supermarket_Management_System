package com.supermarket.management.service;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// ==== Conflict: import thêm từ nhánh dev ====
/*
import com.supermarket.management.entity.Order;
import com.supermarket.management.entity.Product;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.OrderRepository;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
*/
// ==== End conflict ====

import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    // ==== Conflict: chỉ có trong nhánh dev ====
    /*
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;
    */
    // ==== End conflict ====

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public List<OrderDetail> getAllOrderDetailsSortedAsc() {
        return orderDetailRepository.findAllByOrderByOrderIdAsc();
    }

    public List<OrderDetail> getAllOrderDetailsSortedDesc() {
        return orderDetailRepository.findAllByOrderByOrderIdDesc();
    }

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceAsc() {
        return orderDetailRepository.findAllByOrderByTotalPriceAsc();
    }

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceDesc() {
        return orderDetailRepository.findAllByOrderByTotalPriceDesc();
    }

    // ==== Conflict: method chỉ có trong nhánh dev ====
    /*
    @Transactional
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        // Get product
        Product product = productRepository.findById(orderDetail.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check stock
        if (product.getStock() < orderDetail.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
        }

        // Set unit price and total price
        orderDetail.setUnitPrice(product.getPrice());
        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(orderDetail.getQuantity()));
        orderDetail.setTotalPrice(total);

        // Save order detail
        OrderDetail savedDetail = orderDetailRepository.save(orderDetail);

        // Reduce stock
        product.setStock(product.getStock() - orderDetail.getQuantity());
        productRepository.save(product);

        // Update order total
        Order order = orderRepository.findById(orderDetail.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        BigDecimal newTotal = order.getTotalAmount().add(total);

        // Apply discount if any
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            newTotal = newTotal.subtract(newTotal.multiply(discountRate));
        }

        order.setTotalAmount(newTotal);
        orderRepository.save(order);

        return savedDetail;
    }
    */
    // ==== End conflict ====

    // ==== Conflict: chỉ có trong nhánh dev ====
    /*
    public List<OrderDetail> searchOrderDetails(Integer orderId, Integer productId) {
        return orderDetailRepository.searchOrderDetails(orderId, productId);
    }
    */
    // ==== End conflict ====
}
