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

        @GetMapping("/active/{orderId}")
        public ResponseEntity<?> getActiveOrderById(@PathVariable Integer orderId) {
            try {
                Order order = orderService.getActiveOrderById(orderId);
                if (order == null) {
                    return new ResponseEntity<>("Active order not found with ID: " + orderId, HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(order, HttpStatus.OK);
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("Failed to fetch active order: " + e.getMessage(),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
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
        public ResponseEntity<?> createOrder(@RequestBody Order order) {
            try {
                Order savedOrder = orderService.createOrder(order);
                return ResponseEntity.ok(savedOrder);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        @PutMapping("/update/{id}")
        public ResponseEntity<?> updateOrder(@PathVariable("id") Integer id, @RequestBody Order updatedOrder) {
            try {
                Order savedOrder = orderService.updateOrder(id, updatedOrder);
                return ResponseEntity.ok(savedOrder);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

        @DeleteMapping("/cancel/{orderId}")
        public ResponseEntity<Order> cancelOrder(@PathVariable Integer orderId) {
            Order canceledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(canceledOrder);
        }

        @DeleteMapping("/hide/{orderId}")
        public ResponseEntity<Order> hideLegacyOrder(@PathVariable Integer orderId) {
            Order hiddenOrder = orderService.hideLegacyOrder(orderId);
            return ResponseEntity.ok(hiddenOrder);
        }

        // Get Active Orders
        @GetMapping("/active")
        public List<Order> getActiveOrders() {
            return orderService.getActiveOrders();
        }

        // Get Canceled Orders
        @GetMapping("/canceled")
        public List<Order> getCanceledOrders() {
            return orderService.getCanceledOrders();
        }

        // Get Hidden Orders
        @GetMapping("/hidden")
        public List<Order> getHiddenOrders() {
            return orderService.getHiddenOrders();
        }

        // Restore canceled or hidden order
        @PutMapping("/restore/{orderId}")
        public ResponseEntity<Order> restoreOrder(@PathVariable Integer orderId) {
            try {
                Order restoredOrder = orderService.restoreOrder(orderId);
                return ResponseEntity.ok(restoredOrder);
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
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


