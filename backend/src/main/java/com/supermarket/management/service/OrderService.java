package com.supermarket.management.service;

import com.supermarket.management.dto.OrderRequest;
import com.supermarket.management.dto.OrderUpdateRequest;
import com.supermarket.management.entity.Order;
import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.OrderDetailRepository;
import com.supermarket.management.repository.OrderRepository;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getActiveOrderById(Integer orderId) {
        return orderRepository.findByOrderIdAndDeletedTypeIsNull(orderId)
                .orElse(null); // return null if not found
    }

    public List<Order> getOrdersSortedByDateAsc() {
        return orderRepository.findByDeletedTypeIsNullOrderByOrderDateAsc();
    }

    public List<Order> getOrdersSortedByDateDesc() {
        return orderRepository.findByDeletedTypeIsNullOrderByOrderDateDesc();
    }

    public List<Order> getOrdersSortedByTotalAsc() {return orderRepository.findByDeletedTypeIsNullOrderByTotalAmountAsc();}

    public List<Order> getOrdersSortedByTotalDesc() {return orderRepository.findByDeletedTypeIsNullOrderByTotalAmountDesc();}

    @Transactional
    public Order createOrder(Order order) {
        // Validate required fields
        if (order.getCustomerId() == null) {
            throw new IllegalArgumentException("Customer ID is required");
        }
        if (order.getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        // Set order date to today if not provided
        if (order.getOrderDate() == null) {
            order.setOrderDate(LocalDate.now());
        }

        // Force total_amount = 0 at creation
        order.setTotalAmount(BigDecimal.ZERO);

        // Default discount = 0 if not provided
        if (order.getDiscount() == null) {
            order.setDiscount(BigDecimal.ZERO);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Integer orderId, Order updatedOrder) {
        // Find existing order
        Order existingOrder = orderRepository.findByOrderIdAndDeletedTypeIsNull(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        // Update editable fields
        if (updatedOrder.getCustomerId() != null) {
            existingOrder.setCustomerId(updatedOrder.getCustomerId());
        }
        if (updatedOrder.getEmployeeId() != null) {
            existingOrder.setEmployeeId(updatedOrder.getEmployeeId());
        }
        if (updatedOrder.getOrderDate() != null) {
            existingOrder.setOrderDate(updatedOrder.getOrderDate());
        }
        if (updatedOrder.getDiscount() != null) {
            existingOrder.setDiscount(updatedOrder.getDiscount());
        }

        // FIX: Recalculate total from THIS order's details only
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrderId(orderId);
        BigDecimal subtotal = orderDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount to subtotal
        BigDecimal finalTotal = subtotal;
        if (existingOrder.getDiscount() != null && existingOrder.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = existingOrder.getDiscount().divide(BigDecimal.valueOf(100));
            finalTotal = subtotal.subtract(subtotal.multiply(discountRate));
        }

        existingOrder.setTotalAmount(finalTotal);

        // Save and return
        return orderRepository.save(existingOrder);
    }

    // Cancel Order
    public Order cancelOrder(Integer orderId) {
        Order order = orderRepository.findByOrderIdAndDeletedTypeIsNull(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        for (OrderDetail detail : details) {
            Product product = productRepository.findById(detail.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            product.setStock(product.getStock() + detail.getQuantity());
            productRepository.save(product);
        }

        order.setDeletedType("CANCEL");
        return orderRepository.save(order); // return updated order
    }

    // Hide Legacy Order
    @Transactional
    public Order hideLegacyOrder(Integer orderId) {
        Order order = orderRepository.findByOrderIdAndDeletedTypeIsNull(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        order.setDeletedType("HIDE");
        return orderRepository.save(order); // return updated order
    }

    @Transactional
    public Order restoreOrder(Integer orderId) {
        // Fetch order if it is canceled or hidden
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        String deletedType = order.getDeletedType();
        if (deletedType == null) {
            throw new IllegalStateException("Order is already active");
        }

        // If order was canceled, restore stock
        if ("CANCEL".equals(deletedType)) {
            List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
            for (OrderDetail detail : details) {
                Product product = productRepository.findById(detail.getProductId())
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
                product.setStock(product.getStock() - detail.getQuantity()); // reduce stock again
                productRepository.save(product);
            }
        }

        // Set order back to active
        order.setDeletedType(null);
        return orderRepository.save(order);
    }

    // Get all active orders
    public List<Order> getActiveOrders() {
        return orderRepository.findByDeletedTypeIsNull();
    }

    public List<Order> getCanceledOrders() {
        return orderRepository.findByDeletedType("CANCEL");
    }

    public List<Order> getHiddenOrders() {
        return orderRepository.findByDeletedType("HIDE");
    }

    public List<Order> searchOrders(Integer customerId, Integer employeeId, LocalDate orderDate) {
        return orderRepository.searchActiveOrders(customerId, employeeId, orderDate);
    }
}
