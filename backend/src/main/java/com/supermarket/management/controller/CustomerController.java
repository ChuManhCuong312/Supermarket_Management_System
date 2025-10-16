package com.supermarket.management.controller;


import com.supermarket.management.entity.Customer;
import com.supermarket.management.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import com.supermarket.management.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


import java.util.List;


@RestController
@RequestMapping("/api/customers")
public class CustomerController {


    private final CustomerService customerService;


    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers(
            @RequestParam(required = false, defaultValue = "none") String sort,
            @RequestParam(required = false, defaultValue = "name") String sortBy) {
        return customerService.getAllCustomers(sort, sortBy);
    }
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody Customer customer) {
        try {
            Customer newCustomer = customerService.createCustomer(customer);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.ok("Xóa khách hàng thành công!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Integer id, @RequestBody Customer customer) {
        try {
            Customer updatedCustomer = customerService.updateCustomer(id, customer);
            return ResponseEntity.ok(updatedCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi server: " + e.getMessage());
        }
    }
}
