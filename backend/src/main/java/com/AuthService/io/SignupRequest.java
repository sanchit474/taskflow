package com.AuthService.io;

import com.AuthService.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "Name should not be empty")
    private String name;

    @Email(message = "enter valid email")
    @NotBlank(message = "email should not be empty")
    private String email;

    @NotBlank(message = "password should not be empty")
    @Size(min = 6, message = "password must have at least 6 characters")
    private String password;
}
