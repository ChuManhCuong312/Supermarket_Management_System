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

    // Thêm mới
    @Transactional
    public Customer createCustomer(Customer customer) {
        trimCustomer(customer);
        validateCustomer(customer, null);
        if (customer.getMembershipType() == null) customer.setMembershipType("Thường");
        return customerRepository.save(customer);
    }

    // Validator
    private void validateCustomer(Customer customer, Customer existingCustomer) {
        if (customer.getName() == null || customer.getName().isEmpty())
            throw new IllegalArgumentException("Tên không được để trống");


        if (customer.getPhone() == null || !customer.getPhone().matches("^0[0-9]{9}$"))
            throw new IllegalArgumentException("SĐT phải gồm 10 số và bắt đầu bằng 0");


        if (customerRepository.existsByPhone(customer.getPhone()) &&
                (existingCustomer == null || !existingCustomer.getPhone().equals(customer.getPhone())))
            throw new IllegalArgumentException("SĐT đã tồn tại");


        if (customer.getEmail() == null || customer.getEmail().isEmpty())
            throw new IllegalArgumentException("Email không được để trống");


        if (!customer.getEmail().matches("^[A-Za-z0-9+_.-]+@gmail\\.com$"))
            throw new IllegalArgumentException("Email không hợp lệ");


        if (customerRepository.existsByEmail(customer.getEmail()) &&
                (existingCustomer == null || !existingCustomer.getEmail().equals(customer.getEmail())))
            throw new IllegalArgumentException("Email đã tồn tại");


        if (customer.getAddress() == null || customer.getAddress().isEmpty())
            throw new IllegalArgumentException("Địa chỉ không được để trống");


        if (customer.getPoints() == null || customer.getPoints() < 0)
            throw new IllegalArgumentException("Điểm tích lũy không hợp lệ");
    }


    private void trimCustomer(Customer customer) {
        customer.setName(customer.getName() != null ? customer.getName().trim() : null);
        customer.setEmail(customer.getEmail() != null ? customer.getEmail().trim() : null);
        customer.setAddress(customer.getAddress() != null ? customer.getAddress().trim() : null);
    }
}



