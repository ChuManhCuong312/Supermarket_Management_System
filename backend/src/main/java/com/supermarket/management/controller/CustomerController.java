package com.supermarket.management.controller;


import com.supermarket.management.entity.Customer;
import com.supermarket.management.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;
import com.supermarket.management.service.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


import java.util.List;

@CrossOrigin(origins = "*")
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
}
