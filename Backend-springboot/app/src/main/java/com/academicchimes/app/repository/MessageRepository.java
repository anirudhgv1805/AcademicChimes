package com.academicchimes.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.academicchimes.app.models.Message;
import com.academicchimes.app.models.User;
import com.academicchimes.app.models.Group;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndRecipientOrderByTimestampDesc(User sender, User recipient);
    List<Message> findByGroupOrderByTimestampDesc(Group group);
}