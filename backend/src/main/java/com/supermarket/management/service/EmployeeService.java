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

    // Thêm mới nhân viên
    @Transactional
    public Employee createEmployee(Employee employee) {
        trimEmployee(employee);
        validateEmployee(employee, null);
        return employeeRepository.save(employee);
    }

    // Xóa nhân viên
    @Transactional
    public void deleteEmployee(Integer id) {
        if (!employeeRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy nhân viên với ID: " + id);
        }
        employeeRepository.deleteById(id);
    }

    // Chỉnh sửa thông tin nhân viên
    @Transactional
    public Employee updateEmployee(Integer id, Employee updatedEmployee) {
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại"));


        trimEmployee(updatedEmployee);
        validateEmployee(updatedEmployee, existingEmployee);


        existingEmployee.setName(updatedEmployee.getName());
        existingEmployee.setPosition(updatedEmployee.getPosition());
        existingEmployee.setPhone(updatedEmployee.getPhone());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setSalary(updatedEmployee.getSalary());
        existingEmployee.setShift(updatedEmployee.getShift());


        return employeeRepository.save(existingEmployee);
    }

    // Validate dữ liệu
    private void validateEmployee(Employee employee, Employee existingEmployee) {
        if (employee.getName() == null || employee.getName().isEmpty()) {
            throw new IllegalArgumentException("Tên nhân viên không được để trống");
        }
        if (employee.getPhone() == null || employee.getPhone().isEmpty()) {
            throw new IllegalArgumentException("Số điện thoại không được để trống");
        }
        if (employee.getEmail() == null || employee.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Email không được để trống");
        }
        if (employee.getPosition() == null || employee.getPosition().isEmpty()) {
            throw new IllegalArgumentException("Chức vụ không được để trống");
        }
        if (employee.getSalary() == null) {
            throw new IllegalArgumentException("Lương không được để trống");
        }
        if (employee.getShift() == null || employee.getShift().isEmpty()) {
            throw new IllegalArgumentException("Ca làm việc không được để trống");
        }


        String emailRegex = "^[A-Za-z0-9+_.-]+@gmail\\.com$";
        if (!Pattern.matches(emailRegex, employee.getEmail())) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }


        String phoneRegex = "^0[0-9]{9}$";
        if (!Pattern.matches(phoneRegex, employee.getPhone())) {
            throw new IllegalArgumentException("SĐT phải gồm 10 số và bắt đầu bằng 0");
        }


        if (employee.getSalary().signum() < 0) {
            throw new IllegalArgumentException("Lương không thể âm");
        }


        if (existingEmployee == null) {
            if (employeeRepository.existsByEmail(employee.getEmail())) {
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
            }
        } else {
            if (!existingEmployee.getEmail().equals(employee.getEmail())
                    && employeeRepository.existsByEmail(employee.getEmail())) {
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống");
            }
        }


        if (existingEmployee == null) {
            if (employeeRepository.existsByPhone(employee.getPhone())) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại trong hệ thống");
            }
        } else {
            if (!existingEmployee.getPhone().equals(employee.getPhone())
                    && employeeRepository.existsByPhone(employee.getPhone())) {
                throw new IllegalArgumentException("Số điện thoại đã tồn tại trong hệ thống");
            }
        }
    }
    private void trimEmployee(Employee employee) {
        if (employee.getName() != null) employee.setName(employee.getName().trim());
        if (employee.getPosition() != null) employee.setPosition(employee.getPosition().trim());
        if (employee.getPhone() != null) employee.setPhone(employee.getPhone().trim());
        if (employee.getEmail() != null) employee.setEmail(employee.getEmail().trim());
        if (employee.getShift() != null) employee.setShift(employee.getShift().trim());
    }
}