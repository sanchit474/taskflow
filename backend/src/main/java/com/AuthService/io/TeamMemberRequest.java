package com.AuthService.io;

import com.AuthService.entity.UserEntity;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamMemberRequest {

    @NotBlank(message = "Name should not be empty")
    private String name;

    @Email(message = "enter valid email")
    @NotBlank(message = "email should not be empty")
    private String email;

    @NotBlank(message = "Password should not be empty")
    @Size(min = 6, message = "Password must have at least 6 characters")
    private String password;

    @NotNull(message = "Role is required")
    private UserEntity.Role role;
}
