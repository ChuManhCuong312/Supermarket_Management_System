package com.supermarket.management.service;

import com.supermarket.management.entity.Order;
import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.entity.Product;
import com.supermarket.management.exception.ResourceNotFoundException;
import com.supermarket.management.repository.OrderDetailRepository;
import com.supermarket.management.repository.OrderRepository;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    // Search OrderDetail by ID
    public OrderDetail getOrderDetailById(Integer id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OrderDetail not found with ID: " + id));
    }

    public List<OrderDetail> getAllOrderDetailsSortedByProductIdAsc() {return orderDetailRepository.findAllByOrderByProductIdAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedByProductIdDesc() {return orderDetailRepository.findAllByOrderByProductIdDesc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceAsc() {return orderDetailRepository.findAllByOrderByTotalPriceAsc();}

    public List<OrderDetail> getAllOrderDetailsSortedByTotalPriceDesc() {return orderDetailRepository.findAllByOrderByTotalPriceDesc();}

    @Transactional
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        // ✅ First, check if the order exists and is active (deletedType = null)
        Order order = orderRepository.findById(orderDetail.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // ✅ Validate that order is active (not canceled or hidden)
        if (order.getDeletedType() != null) {
            throw new IllegalStateException(
                    "Không thể thêm đơn hàng đã xóa"
            );
        }

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

        // Update order total - Calculate total from ALL order details
        List<OrderDetail> allDetails = orderDetailRepository.findByOrderId(order.getOrderId());
        BigDecimal subtotal = allDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Apply discount to the SUBTOTAL
        BigDecimal newTotal = subtotal;
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            newTotal = subtotal.subtract(subtotal.multiply(discountRate));
        }

        order.setTotalAmount(newTotal);
        orderRepository.save(order);

        return savedDetail;
    }

    @Transactional
    public OrderDetail updateOrderDetail(Integer id, OrderDetail updatedDetail) {
        OrderDetail existing = orderDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found"));

        // ✅ Check if the order is active before allowing update
        Order order = orderRepository.findById(existing.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getDeletedType() != null) {
            throw new IllegalStateException(
                    "Không thể thêm đơn hàng đã xóa"

            );
        }

        // Get product and restore stock from old quantity
        Product product = productRepository.findById(existing.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Restore old stock
        product.setStock(product.getStock() + existing.getQuantity());

        // Check if new quantity is available
        if (product.getStock() < updatedDetail.getQuantity()) {
            throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
        }

        // Update order detail fields
        existing.setQuantity(updatedDetail.getQuantity());
        existing.setUnitPrice(product.getPrice());
        BigDecimal total = product.getPrice().multiply(BigDecimal.valueOf(updatedDetail.getQuantity()));
        existing.setTotalPrice(total);

        // Save updated detail
        OrderDetail saved = orderDetailRepository.save(existing);

        // Deduct new stock
        product.setStock(product.getStock() - updatedDetail.getQuantity());
        productRepository.save(product);

        // Recalculate order total
        List<OrderDetail> allDetails = orderDetailRepository.findByOrderId(order.getOrderId());
        BigDecimal subtotal = allDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal newTotal = subtotal;
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            newTotal = subtotal.subtract(subtotal.multiply(discountRate));
        }

        order.setTotalAmount(newTotal);
        orderRepository.save(order);

        return saved;
    }

    @Transactional
    public OrderDetail deleteOrderDetail(Integer id) {
        OrderDetail orderDetail = orderDetailRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order detail not found"));

        // ✅ Check if the order is active before allowing to delete
        Order order = orderRepository.findById(orderDetail.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getDeletedType() != null) {
            throw new IllegalStateException(
                    "Không thể thêm đơn hàng đã xóa"
            );
        }

        // Restore product stock
        Product product = productRepository.findById(orderDetail.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStock(product.getStock() + orderDetail.getQuantity());
        productRepository.save(product);

        // Delete order detail
        orderDetailRepository.delete(orderDetail);

        // Recalculate order total
        List<OrderDetail> remainingDetails = orderDetailRepository.findByOrderId(order.getOrderId());
        BigDecimal subtotal = remainingDetails.stream()
                .map(OrderDetail::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal newTotal = subtotal;
        if (order.getDiscount() != null && order.getDiscount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountRate = order.getDiscount().divide(BigDecimal.valueOf(100));
            newTotal = subtotal.subtract(subtotal.multiply(discountRate));
        }

        order.setTotalAmount(newTotal);
        orderRepository.save(order);

        return orderDetail;
    }

    public List<OrderDetail> searchOrderDetails(Integer orderId, Integer productId) {
        return orderDetailRepository.searchOrderDetails(orderId, productId);
    }

    public Page<OrderDetail> getOrderDetailsByPage(int page, int size) {
        return orderDetailRepository.findAll(PageRequest.of(page, size));
    }
    public Page<OrderDetail> searchByCriteria(Integer orderId, Integer productId, Pageable pageable) {
        return orderDetailRepository.findByCriteria(orderId, productId, pageable);
    }

}
