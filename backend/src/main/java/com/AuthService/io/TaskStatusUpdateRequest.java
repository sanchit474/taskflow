package com.AuthService.io;

import com.AuthService.entity.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskStatusUpdateRequest {

    @NotNull(message = "status is required")
    private TaskStatus status;
}
