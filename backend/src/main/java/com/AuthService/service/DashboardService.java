package com.AuthService.service;

import com.AuthService.io.TaskResponse;
import com.AuthService.io.TaskStatusSummaryResponse;

import java.util.List;

public interface DashboardService {

    List<TaskStatusSummaryResponse> getTasksByStatus();

    List<TaskResponse> getOverdueTasks();

    List<TaskResponse> getMyTasks();
}
