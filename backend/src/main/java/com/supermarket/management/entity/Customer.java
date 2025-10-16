package com.supermarket.management.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer id;


    @Column(nullable = false, length = 100)
    private String name;


    @Column(length = 10, nullable = false)
    private String phone;


    @Column(unique = true, length = 100, nullable = false)
    private String email;


    @Column(length = 255, nullable = false)
    private String address;


    @Column(name = "membership_type", length = 50)
    private String membershipType = "Thường";


    @Min(value = 0, message = "Điểm tích lũy không thể âm")
    @Column(name = "points", nullable = false)
    private Integer points = 0;


    // Getter & Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; } }
