package com.academicchimes.app.kafka;

import com.academicchimes.app.models.Message;
import com.academicchimes.app.services.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageConsumer {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "chat-messages", groupId = "chat-app-group")
    public void consume(Message message) {
        messageService.saveMessage(message);
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}