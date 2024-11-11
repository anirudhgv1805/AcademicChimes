package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.academicchimes.app.models.User;

public interface UserRepository extends JpaRepository<User,Long>{
    
}
