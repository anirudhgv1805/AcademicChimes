package com.academicchimes.app.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic chatMessagesTopic() {
        return TopicBuilder.name("chat-messages")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic userPresenceTopic() {
        return TopicBuilder.name("user-presence")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic groupUpdatesTopic() {
        return TopicBuilder.name("group-updates")
                .partitions(3)
                .replicas(1)
                .build();
    }
}