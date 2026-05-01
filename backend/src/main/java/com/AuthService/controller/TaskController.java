package com.AuthService.controller;

import com.AuthService.io.TaskAssignRequest;
import com.AuthService.io.TaskCreateRequest;
import com.AuthService.io.TaskResponse;
import com.AuthService.io.TaskStatusUpdateRequest;
import com.AuthService.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse createTask(@Valid @RequestBody TaskCreateRequest request) {
        return taskService.createTask(request);
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public List<TaskResponse> getTasksByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProject(projectId);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public TaskResponse updateTaskStatus(@PathVariable Long id, @Valid @RequestBody TaskStatusUpdateRequest request) {
        return taskService.updateTaskStatus(id, request.getStatus());
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public TaskResponse assignTask(@PathVariable Long id, @Valid @RequestBody TaskAssignRequest request) {
        return taskService.assignTask(id, request.getAssigneeEmail());
    }
}
