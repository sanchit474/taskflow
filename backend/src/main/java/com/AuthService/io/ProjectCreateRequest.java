package com.AuthService.io;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectCreateRequest {

    @NotBlank(message = "project name is required")
    private String name;

    private String description;

    private List<String> memberEmails;
}
