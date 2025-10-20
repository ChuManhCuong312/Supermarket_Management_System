package com.supermarket.management.service;


import com.supermarket.management.entity.Customer;
import com.supermarket.management.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // Hiển thị danh sách
    public List<Customer> getAllCustomers(String sort, String sortBy) {
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


