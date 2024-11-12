package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.academicchimes.app.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByRegisterNoOrStaffId(String registerNo, String staffId);
    boolean existsByRegisterNoOrStaffId(String registerNo, String staffId);
}