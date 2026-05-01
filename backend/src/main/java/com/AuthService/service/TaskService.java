package com.AuthService.service;

import com.AuthService.io.TaskCreateRequest;
import com.AuthService.io.TaskResponse;
import com.AuthService.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    TaskResponse createTask(TaskCreateRequest request);

    List<TaskResponse> getTasksByProject(Long projectId);

    TaskResponse updateTaskStatus(Long taskId, TaskStatus status);

    TaskResponse assignTask(Long taskId, String assigneeEmail);
}
