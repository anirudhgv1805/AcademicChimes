package com.academicchimes.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.academicchimes.app.models.User;
import com.academicchimes.app.repository.UserRepository;
import java.util.List;

@Service
public class UserService {
    @Autowired    
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User saveUser(User user) {
        if (userRepository.existsByRegisterNoOrStaffId(user.getRegisterNo(), user.getStaffId())) {
            throw new RuntimeException("User already exists");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByRegisterNoOrStaffId(String id) {
        return userRepository.findByRegisterNoOrStaffId(id, id);
    }

    public boolean authenticate(User user, String rawPassword) {
        return user != null && passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public List<User> searchUsers(String query) {
        // Implement search logic
        return userRepository.findAll(); // Placeholder
    }
}