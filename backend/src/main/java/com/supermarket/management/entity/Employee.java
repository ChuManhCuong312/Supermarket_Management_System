package com.supermarket.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employee_id")
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String position;

    @Column(length = 15, unique = true)
    private String phone;

    @Column(unique = true, length = 100)
    private String email;

    @Min(value = 0, message = "Lương không thể âm")
    @Column(nullable = false)
    private java.math.BigDecimal salary;

    @Column(length = 50)
    private String shift;

    public Employee() {}


    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public java.math.BigDecimal getSalary() { return salary; }
    public void setSalary(java.math.BigDecimal salary) { this.salary = salary; }

    public String getShift() { return shift; }
    public void setShift(String shift) { this.shift = shift; }

    @Override
    public String toString() {
        return String.format("ID: %d | Tên: %s | Chức vụ: %s | SĐT: %s | Email: %s | Lương: %s | Ca: %s",
                id, name, position, phone, email, salary, shift);
    }
}