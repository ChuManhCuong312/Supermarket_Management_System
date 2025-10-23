package com.supermarket.management.controller;

import com.supermarket.management.entity.OrderDetail;
import com.supermarket.management.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderdetails")
@CrossOrigin(origins = "*")
public class OrderDetailController {

    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public ResponseEntity<?> getAllOrderDetails() {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getAllOrderDetails();
            return new ResponseEntity<>(orderDetails, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    "Failed to fetch order details: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    // GET /api/order-details/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetailById(@PathVariable("id") Integer id) {
        try {
            OrderDetail orderDetail = orderDetailService.getOrderDetailById(id);
            return ResponseEntity.ok(orderDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Sorted: use query param 'sort=asc' or 'sort=desc'
    @GetMapping("/sorted/productid")
    public List<OrderDetail> getAllOrderDetailsSortedByProductId(
            @RequestParam(defaultValue = "asc") String sort) {
        if (sort.equalsIgnoreCase("desc")) {
            return orderDetailService.getAllOrderDetailsSortedByProductIdDesc();
        }
        return orderDetailService.getAllOrderDetailsSortedByProductIdAsc();
    }

    // Sorted: use query param 'sort=asc' or 'sort=desc'
    @GetMapping("/sorted/totalprice")
    public List<OrderDetail> getAllOrderDetailsSortedByTotalPrice(@RequestParam(defaultValue = "asc") String sort) {
        if (sort.equalsIgnoreCase("desc")) {
            return orderDetailService.getAllOrderDetailsSortedByTotalPriceDesc();
        }
        return orderDetailService.getAllOrderDetailsSortedByTotalPriceAsc();
    }

    @PostMapping("/add")
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail savedDetail = orderDetailService.createOrderDetail(orderDetail);
            return ResponseEntity.ok(savedDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateOrderDetail(@PathVariable("id") Integer id, @RequestBody OrderDetail updatedDetail) {
        try {
            OrderDetail savedDetail = orderDetailService.updateOrderDetail(id, updatedDetail);
            return ResponseEntity.ok(savedDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable("id") Integer id) {
        try {
            OrderDetail deletedDetail = orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.ok(deletedDetail);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchOrderDetails(
            @RequestParam(required = false) Integer orderId,
            @RequestParam(required = false) Integer productId
    ) {
        try {
            List<OrderDetail> details = orderDetailService.searchOrderDetails(orderId, productId);
            return new ResponseEntity<>(details, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to search order details: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
