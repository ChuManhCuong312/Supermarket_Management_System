package com.supermarket.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Integer supplierId;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, length = 15)
    private String phone;

    @Email
    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 255)
    private String address;

    @Column(name = "contact_person", length = 100)
    private String contactPerson;

    // Getters and Setters
    public Integer getSupplierId() {return supplierId;}
    public void setSupplierId(Integer supplierId) {this.supplierId = supplierId;}
    public String getCompanyName() {return companyName;}
    public void setCompanyName(String companyName) {this.companyName = companyName;}
    public String getPhone() {return phone;}
    public void setPhone(String phone) {this.phone = phone;}
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}
    public String getAddress() {return address;}
    public void setAddress(String address) {this.address = address;}
    public String getContactPerson() {return contactPerson;}
    public void setContactPerson(String contactPerson) {this.contactPerson = contactPerson;}
}
