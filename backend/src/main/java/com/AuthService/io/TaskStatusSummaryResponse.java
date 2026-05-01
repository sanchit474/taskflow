package com.AuthService.io;

import com.AuthService.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TaskStatusSummaryResponse {

    private TaskStatus status;
    private long count;
}
