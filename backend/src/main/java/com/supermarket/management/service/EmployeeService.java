package com.supermarket.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.supermarket.management.repository.EmployeeRepository;
import com.supermarket.management.entity.Employee;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Lấy danh sách tất cả nhân viên
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}