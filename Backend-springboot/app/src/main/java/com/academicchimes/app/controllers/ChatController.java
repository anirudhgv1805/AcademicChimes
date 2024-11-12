package com.academicchimes.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import com.academicchimes.app.models.Message;
import com.academicchimes.app.models.User;
import com.academicchimes.app.models.WebSocketMessage;
import com.academicchimes.app.kafka.ChatMessageProducer;
import com.academicchimes.app.models.Group;
import com.academicchimes.app.services.UserService;
import com.academicchimes.app.services.GroupService;
import com.academicchimes.app.services.MessageService;

import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/chat")

public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private KafkaTemplate<String, Message> kafkaTemplate;

    @Autowired
    private ChatMessageProducer chatMessageProducer;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/groups")
    public ResponseEntity<?> createGroup(@RequestBody Group group, @RequestParam String creatorId) {
        Group createdGroup = groupService.createGroup(group.getName(), creatorId);
        WebSocketMessage<Group> message = new WebSocketMessage<>("CREATE", createdGroup);
        messagingTemplate.convertAndSend("/topic/group-updates", message);
        return ResponseEntity.ok(createdGroup);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        Message savedMessage = messageService.saveMessage(message);
        WebSocketMessage<Message> wsMessage = new WebSocketMessage<>("NEW_MESSAGE", savedMessage);
        messagingTemplate.convertAndSend("/topic/messages", wsMessage);
        return ResponseEntity.ok(savedMessage);
    }

    

    @GetMapping("/groups")
    public ResponseEntity<Set<Group>> getUserGroups(@RequestParam String userId) {
        User user = userService.findByRegisterNoOrStaffId(userId);
        return ResponseEntity.ok(groupService.getUserGroups(user));
    }


    @PostMapping("/groups/{groupId}/members")
    public ResponseEntity<?> addGroupMember(@PathVariable Long groupId, @RequestParam String userId) {
        User user = userService.findByRegisterNoOrStaffId(userId);
        Group group = groupService.addMember(groupService.getUserGroups(user).stream().filter(g -> g.getId().equals(groupId)).findFirst().orElse(null), user);
        return ResponseEntity.ok(group);
    }

    @GetMapping("/messages/direct")
    public ResponseEntity<List<Message>> getDirectMessages(@RequestParam String senderId, @RequestParam String recipientId) {
        User sender = userService.findByRegisterNoOrStaffId(senderId);
        User recipient = userService.findByRegisterNoOrStaffId(recipientId);
        return ResponseEntity.ok(messageService.getDirectMessages(sender, recipient));
    }

    @GetMapping("/messages/group/{groupId}")
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable Long groupId) {
        Group group = groupService.getUserGroups(null).stream().filter(g -> g.getId().equals(groupId)).findFirst().orElse(null);
        return ResponseEntity.ok(messageService.getGroupMessages(group));
    }

    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
}