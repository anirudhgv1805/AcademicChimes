package com.academicchimes.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.academicchimes.app.models.User;
import com.academicchimes.app.repository.UserRepository;

@Service
public class UserService {
    @Autowired    
    private UserRepository userRepository;

    public User saveUser(User user){
        return userRepository.save(user);
    }

    public User findByRegisterNoOrStaffId(String id) {
        return userRepository.findByRegisterNoOrStaffId(id, id);
    }

    public boolean authenticate(User user, String password) {
        return user != null && user.getPassword().equals(password);
    }
}