package com.academicchimes.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.academicchimes.app.models.Group;
import com.academicchimes.app.models.User;
import com.academicchimes.app.repository.GroupRepository;
import java.util.Set;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    public Group createGroup(String name, User creator) {
        Group group = new Group();
        group.setName(name);
        group.setCreator(creator);
        return groupRepository.save(group);
    }

    public Group addMember(Group group, User user) {
        group.getMembers().add(user);
        return groupRepository.save(group);
    }

    public Set<Group> getUserGroups(User user) {
        return groupRepository.findByMembers(user);
    }
}