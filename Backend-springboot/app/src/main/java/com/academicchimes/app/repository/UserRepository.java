package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.academicchimes.app.models.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByRegisterNoOrStaffId(String registerNo, String staffId);
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
    "FROM User u WHERE (u.registerNo = :registerNo AND u.role = 'student') " +
    "OR (u.staffId = :staffId AND u.role = 'staff')")
    boolean existsByRegisterNoOrStaffId(@Param("registerNo") String registerNo, 
                                        @Param("staffId") String staffId);
}