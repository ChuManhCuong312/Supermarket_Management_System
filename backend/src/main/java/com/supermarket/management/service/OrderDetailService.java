package com.supermarket.management.service;

import com.supermarket.management.entity.Order;
import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.OrderDetailRepository;
import com.supermarket.management.repository.OrderRepository;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<OrderDetail> getAllOrderDetails() {return orderDetailRepository.findAll();}

    public List<OrderDetail> getAllOrderDetailsSortedByProductIdAsc() {return orderDetailRepository.findAllByOrderByProductIdAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedByProductIdDesc() {return orderDetailRepository.findAllByOrderByProductIdDesc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceAsc() {return orderDetailRepository.findAllByOrderByTotalPriceAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceDesc() {return orderDetailRepository.findAllByOrderByTotalPriceDesc();}

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

    @Transactional
    public OrderDetail updateOrderDetail(Integer orderDetailId, OrderDetail updatedDetail) {
        // Find existing order detail
        OrderDetail existingDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("OrderDetail not found"));

        // Find old product and restore its stock
        Product oldProduct = productRepository.findById(existingDetail.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Old product not found"));
        oldProduct.setStock(oldProduct.getStock() + existingDetail.getQuantity());
        productRepository.save(oldProduct);

        // If product changed, load new product
        Product newProduct;
        if (!existingDetail.getProductId().equals(updatedDetail.getProductId())) {
            newProduct = productRepository.findById(updatedDetail.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("New product not found"));
        } else {
            newProduct = oldProduct;
        }

        // Check stock for new quantity
        if (newProduct.getStock() < updatedDetail.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock for product: " + newProduct.getName());
        }

        // Update unit price and total price
        updatedDetail.setUnitPrice(newProduct.getPrice());
        BigDecimal newTotal = newProduct.getPrice().multiply(BigDecimal.valueOf(updatedDetail.getQuantity()));
        updatedDetail.setTotalPrice(newTotal);

        // Reduce new product stock
        newProduct.setStock(newProduct.getStock() - updatedDetail.getQuantity());
        productRepository.save(newProduct);

        // Update order detail fields
        existingDetail.setProductId(updatedDetail.getProductId());
        existingDetail.setQuantity(updatedDetail.getQuantity());
        existingDetail.setUnitPrice(updatedDetail.getUnitPrice());
        existingDetail.setTotalPrice(updatedDetail.getTotalPrice());

        orderDetailRepository.save(existingDetail);

        // Recalculate order total
        Order order = orderRepository.findById(existingDetail.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        BigDecimal recalculatedTotal = orderDetailRepository.findAll().stream()
                .filter(od -> od.getOrderId().equals(order.getOrderId()))
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            recalculatedTotal = recalculatedTotal.subtract(recalculatedTotal.multiply(discountRate));
        }

        order.setTotalAmount(recalculatedTotal);
        orderRepository.save(order);

        return existingDetail;
    }

    @Transactional
    public OrderDetail deleteOrderDetail(Integer orderDetailId) {
        // Find existing order detail
        OrderDetail existingDetail = orderDetailRepository.findById(orderDetailId)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found with ID: " + orderDetailId));

        // Restore product stock
        Product product = productRepository.findById(existingDetail.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found for ID: " + existingDetail.getProductId()));

        product.setStock(product.getStock() + existingDetail.getQuantity());
        productRepository.save(product);

        // Get the parent order
        Order order = orderRepository.findById(existingDetail.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found for ID: " + existingDetail.getOrderId()));

        // Delete the order detail
        orderDetailRepository.delete(existingDetail);

        // Recalculate total for the order
        BigDecimal recalculatedTotal = orderDetailRepository.findAll().stream()
                .filter(od -> od.getOrderId().equals(order.getOrderId()))
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount if any
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            recalculatedTotal = recalculatedTotal.subtract(recalculatedTotal.multiply(discountRate));
        }

        order.setTotalAmount(recalculatedTotal);
        orderRepository.save(order);

        // return deleted detail for response
        return existingDetail;
    }

    public List<OrderDetail> searchOrderDetails(Integer orderId, Integer productId) {
        return orderDetailRepository.searchOrderDetails(orderId, productId);
    }
}
