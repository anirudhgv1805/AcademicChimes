package com.academicchimes.app.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import com.academicchimes.app.models.Message;
import com.academicchimes.app.models.User;
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
    private KafkaTemplate<String, Message> kafkaTemplate;

    @Autowired
    private ChatMessageProducer chatMessageProducer;

    @Autowired
    private UserService userService;

    @Autowired
    private GroupService groupService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        chatMessageProducer.sendMessage(message);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/groups")
    public ResponseEntity<Set<Group>> getUserGroups(@RequestParam String userId) {
        User user = userService.findByRegisterNoOrStaffId(userId);
        return ResponseEntity.ok(groupService.getUserGroups(user));
    }

    @PostMapping("/groups")
    public ResponseEntity<?> createGroup(@RequestBody Group group, @RequestParam String creatorId) {
        User creator = userService.findByRegisterNoOrStaffId(creatorId);
        if (!"staff".equals(creator.getRole())) {
            return ResponseEntity.badRequest().body("Only staff can create groups");
        }
        Group createdGroup = groupService.createGroup(group.getName(), creator);
        return ResponseEntity.ok(createdGroup);
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