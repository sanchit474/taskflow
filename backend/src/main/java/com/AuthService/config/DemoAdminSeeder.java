package com.AuthService.config;

import com.AuthService.entity.UserEntity;
import com.AuthService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DemoAdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "admin@taskflow.com";
        String rawPassword = "admin123";

        UserEntity admin = userRepository.findByEmail(email)
                .orElseGet(UserEntity::new);

        admin.setUserId(admin.getUserId() != null ? admin.getUserId() : "admin-taskflow-demo");
        admin.setFullName("Admin");
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(rawPassword));
        admin.setRole(UserEntity.Role.ADMIN);

        userRepository.save(admin);
    }
}