package com.AuthService.io;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskCreateRequest {

    @NotBlank(message = "task title is required")
    private String title;

    private String description;

    @NotNull(message = "projectId is required")
    private Long projectId;

    private LocalDate dueDate;

    private String assigneeEmail;
}
