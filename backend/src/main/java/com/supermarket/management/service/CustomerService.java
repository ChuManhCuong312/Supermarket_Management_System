package com.supermarket.management.service;


import com.supermarket.management.entity.Customer;
import com.supermarket.management.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class CustomerService {


    private final CustomerRepository customerRepository;


    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }


    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
}
