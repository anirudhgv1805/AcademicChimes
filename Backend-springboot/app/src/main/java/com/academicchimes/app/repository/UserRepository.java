package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.academicchimes.app.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE u.registerNo = :id OR u.staffId = :id")
    User findByRegisterNoOrStaffId(@Param("id") String id);
}