package com.AuthService.service;

import com.AuthService.entity.UserEntity;
import com.AuthService.io.ProfileResponse;
import com.AuthService.io.SignupRequest;
import com.AuthService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        UserEntity user = UserEntity.builder()
                .userId(UUID.randomUUID().toString())
                .fullName(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserEntity.Role.MEMBER)
                .build();

        UserEntity saved = userRepository.save(user);

        return ProfileResponse.builder()
                .userId(saved.getUserId())
                .name(saved.getFullName())
                .email(saved.getEmail())
                .role(saved.getRole().name())
                .build();
    }
}
