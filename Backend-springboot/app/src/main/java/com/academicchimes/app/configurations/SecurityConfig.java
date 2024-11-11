// package com.academicchimes.app.configurations;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// import static org.springframework.security.config.Customizer.withDefaults;

// @Configuration
// public class SecurityConfig {

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .csrf(csrf -> csrf.disable())  // Disable CSRF for simplicity; enable if needed
//                 .authorizeHttpRequests(requests -> requests
//                         .requestMatchers("/public/**").permitAll()  // Allow access to public endpoints
//                         .anyRequest().authenticated())
//                 .formLogin(withDefaults())
//                 .httpBasic(withDefaults());  // Enable HTTP Basic authentication with default settings

//         return http.build();
//     }
// }
