    package com.supermarket.management.controller;

    import com.supermarket.management.dto.OrderRequest;
    import  com.supermarket.management.entity.Order;
    import com.supermarket.management.service.OrderService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

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
    }
