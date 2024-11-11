package com.academicchimes.app.models;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "\"user\"")
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Primary key

    private String name;
    private String email;
    private String password;
    private String registerNo; // Applicable for students
    private String dept; // Common field for both student and staff
    private String staffId; // Applicable for staff
    private String designation; // Applicable for staff
    private String role; // "student" or "staff"

    // Constructors
    public User() {}

    public User(String name, String email, String password, String registerNo, String dept, String staffId, String designation, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.registerNo = registerNo;
        this.dept = dept;
        this.staffId = staffId;
        this.designation = designation;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRegisterNo() {
        return registerNo;
    }

    public void setRegisterNo(String registerNo) {
        this.registerNo = registerNo;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getStaffId() {
        return staffId;
    }

    public void setStaffId(String staffId) {
        this.staffId = staffId;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String toString(){
        if(registerNo!=null)
            return "User[ name="+name+",email="+email+",password="+password+
            "department="+dept+",id="+ registerNo+",role="+role+"]";
        else
        return "User[ name="+name+",email="+email+",password="+password+
                ",id="+ staffId+"designation"+designation+",role="+role+"]";
    }
}
