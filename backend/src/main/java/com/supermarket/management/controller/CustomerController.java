package com.supermarket.management.controller;

import com.supermarket.management.entity.Customer;
import com.supermarket.management.repository.CustomerRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<Customer> getAllCustomers(
            @RequestParam(required = false, defaultValue = "none") String sort,
            @RequestParam(required = false, defaultValue = "name") String sortBy) {

        String sortField = "points".equalsIgnoreCase(sortBy) ? "points" : "name";

        if ("desc".equalsIgnoreCase(sort)) {
            return customerRepository.findAll(Sort.by(Sort.Direction.DESC, sortField));
        } else if ("asc".equalsIgnoreCase(sort)) {
            return customerRepository.findAll(Sort.by(Sort.Direction.ASC, sortField));
        } else {
            return customerRepository.findAll();
        }
    }
}
