package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.academicchimes.app.models.Group;
import com.academicchimes.app.models.User;
import java.util.Set;

public interface GroupRepository extends JpaRepository<Group, Long> {
    Set<Group> findByMembers(User user);
}