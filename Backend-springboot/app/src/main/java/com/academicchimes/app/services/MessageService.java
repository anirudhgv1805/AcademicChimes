package com.academicchimes.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.academicchimes.app.models.Message;
import com.academicchimes.app.models.User;
import com.academicchimes.app.models.Group;
import com.academicchimes.app.repository.MessageRepository;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        return messageRepository.save(message);
    }

    public List<Message> getDirectMessages(User sender, User recipient) {
        return messageRepository.findBySenderAndRecipientOrderByTimestampDesc(sender, recipient);
    }

    public List<Message> getGroupMessages(Group group) {
        return messageRepository.findByGroupOrderByTimestampDesc(group);
    }
}