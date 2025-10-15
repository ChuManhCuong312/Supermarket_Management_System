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
            @RequestParam(defaultValue = "asc") String sort) {

        Sort.Direction direction = sort.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        return customerRepository.findAll(Sort.by(direction, "name"));
    }
}
