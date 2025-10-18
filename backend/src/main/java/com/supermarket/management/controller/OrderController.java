    package com.supermarket.management.controller;

    import com.supermarket.management.dto.OrderRequest;
    import com.supermarket.management.dto.OrderUpdateRequest;
    import  com.supermarket.management.entity.Order;
    import com.supermarket.management.service.OrderService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.time.LocalDate;
    import java.util.List;

    @RestController
    @RequestMapping("/api/orders")
    @CrossOrigin(origins = "*") // allow frontend connection
    public class OrderController {

        @Autowired
        private OrderService orderService;

        @GetMapping
        public List<Order> getAllOrders() {
            return orderService.getAllOrders();
        }

        // Sorted: use query param 'sort=asc' or 'sort=desc'
        @GetMapping("/sorted/buydate")
        public List<Order> getAllOrdersSortedByDate(@RequestParam(defaultValue = "asc") String sort) {
            if (sort.equalsIgnoreCase("desc")) {
                return orderService.getOrdersSortedByDateDesc();
            }
            return orderService.getOrdersSortedByDateAsc();
        }

        // Sorted: use query param 'sort=asc' or 'sort=desc'
        @GetMapping("/sorted/totalamount")
        public List<Order> getAllOrdersSortedByTotalAmount(@RequestParam(defaultValue = "asc") String sort) {
            if (sort.equalsIgnoreCase("desc")) {
                return orderService.getOrdersSortedByTotalDesc();
            }
            return orderService.getOrdersSortedByTotalAsc();
        }


        @PostMapping("/add")
        public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
            try {
                Order order = orderService.createOrder(orderRequest);
                return new ResponseEntity<>(order, HttpStatus.CREATED);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>(
                        "Failed to create order: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR
                );
            }
        }

        @PutMapping("/{orderId}")
        public ResponseEntity<?> updateOrder(
                @PathVariable Integer orderId,
                @RequestBody OrderUpdateRequest updateRequest) {
            try {
                Order updatedOrder = orderService.updateOrderAmountAndDiscount(orderId, updateRequest);
                return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("Failed to update order: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @GetMapping("/search")
        public ResponseEntity<?> searchOrders(
                @RequestParam(required = false) Integer customerId,
                @RequestParam(required = false) Integer employeeId,
                @RequestParam(required = false) String orderDate // pass as "yyyy-MM-dd"
        ) {
            try {
                LocalDate date = null;
                if (orderDate != null && !orderDate.isEmpty()) {
                    date = LocalDate.parse(orderDate);
                }

                List<Order> orders = orderService.searchOrders(customerId, employeeId, date);
                return new ResponseEntity<>(orders, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("Failed to search orders: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


