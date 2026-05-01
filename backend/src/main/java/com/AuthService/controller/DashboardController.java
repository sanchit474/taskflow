package com.AuthService.controller;

import com.AuthService.io.TaskResponse;
import com.AuthService.io.TaskStatusSummaryResponse;
import com.AuthService.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/tasks-by-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public List<TaskStatusSummaryResponse> getTasksByStatus() {
        return dashboardService.getTasksByStatus();
    }

    @GetMapping("/overdue-tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public List<TaskResponse> getOverdueTasks() {
        return dashboardService.getOverdueTasks();
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public List<TaskResponse> getMyTasks() {
        return dashboardService.getMyTasks();
    }
}
