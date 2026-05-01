package com.AuthService.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskAssignRequest {

    @Email(message = "enter valid email")
    @NotBlank(message = "email should not be empty")
    private String assigneeEmail;
}
