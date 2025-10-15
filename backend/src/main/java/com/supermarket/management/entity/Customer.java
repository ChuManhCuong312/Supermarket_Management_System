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

    @NotBlank(message = "Tên không được để trống")
    @Column(nullable = false, length = 100)
    private String name;

    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại phải gồm đúng 10 chữ số")
    @Column(length = 10, nullable = false)
    private String phone;

    @Email(message = "Email không hợp lệ")
    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 255)
    private String address;

    @Column(name = "membership_type", length = 50)
    private String membershipType = "Thường";

    @Min(value = 0, message = "Điểm tích lũy không thể âm")
    @Column(name = "points")
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
    public void setPoints(Integer points) { this.points = points; }
}
