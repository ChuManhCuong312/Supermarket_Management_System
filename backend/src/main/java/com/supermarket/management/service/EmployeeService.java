package com.supermarket.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.supermarket.management.repository.EmployeeRepository;
import com.supermarket.management.entity.Employee;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Hiển thị và sắp xếp
    public List<Employee> getAllEmployees(String sort, String sortBy) {
        String sortField = "salary".equalsIgnoreCase(sortBy) ? "salary" : "name";

        if ("desc".equalsIgnoreCase(sort)) {
            return employeeRepository.findAll(Sort.by(Sort.Direction.DESC, sortField));
        } else if ("asc".equalsIgnoreCase(sort)) {
            return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, sortField));
        } else {
            return employeeRepository.findAll();
        }
    }


}