package com.AuthService.service;

import com.AuthService.entity.TaskEntity;
import com.AuthService.entity.TaskStatus;
import com.AuthService.io.TaskResponse;
import com.AuthService.io.TaskStatusSummaryResponse;
import com.AuthService.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TaskRepository taskRepository;
    private final CurrentUserService currentUserService;

    @Override
    public List<TaskStatusSummaryResponse> getTasksByStatus() {
        return taskRepository.countByStatus().stream()
                .map(tuple -> TaskStatusSummaryResponse.builder()
                        .status((TaskStatus) tuple[0])
                        .count((Long) tuple[1])
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getOverdueTasks() {
        return taskRepository.findByDueDateBeforeAndStatusNot(LocalDate.now(), TaskStatus.DONE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getMyTasks() {
        String email = currentUserService.getCurrentEmail();
        return taskRepository.findByAssignedToEmail(email)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse toResponse(TaskEntity task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .assigneeEmail(task.getAssignedTo() != null ? task.getAssignedTo().getEmail() : null)
                .projectId(task.getProject().getId())
                .projectName(task.getProject().getName())
                .build();
    }
}
