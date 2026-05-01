package com.AuthService.service;

import com.AuthService.entity.ProjectEntity;
import com.AuthService.entity.TaskEntity;
import com.AuthService.entity.TaskStatus;
import com.AuthService.entity.UserEntity;
import com.AuthService.io.TaskCreateRequest;
import com.AuthService.io.TaskResponse;
import com.AuthService.repository.ProjectRepository;
import com.AuthService.repository.TaskRepository;
import com.AuthService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    public TaskResponse createTask(TaskCreateRequest request) {
        ProjectEntity project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        UserEntity assignee = resolveAssignee(request.getAssigneeEmail(), project);

        TaskEntity task = TaskEntity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TaskStatus.TODO)
                .dueDate(request.getDueDate())
                .assignedTo(assignee)
                .project(project)
                .build();

        TaskEntity saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Override
    public List<TaskResponse> getTasksByProject(Long projectId) {
        String email = currentUserService.getCurrentEmail();
        if (!projectRepository.hasProjectAccess(projectId, email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this project");
        }

        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TaskResponse updateTaskStatus(Long taskId, TaskStatus status) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        String email = currentUserService.getCurrentEmail();
        boolean hasAccess = projectRepository.hasProjectAccess(task.getProject().getId(), email);
        if (!hasAccess) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this task");
        }

        task.setStatus(status);
        TaskEntity saved = taskRepository.save(task);
        return toResponse(saved);
    }

    @Override
    public TaskResponse assignTask(Long taskId, String assigneeEmail) {
        TaskEntity task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));

        UserEntity assignee = resolveAssignee(assigneeEmail, task.getProject());
        task.setAssignedTo(assignee);

        TaskEntity saved = taskRepository.save(task);
        return toResponse(saved);
    }

    private UserEntity resolveAssignee(String assigneeEmail, ProjectEntity project) {
        if (assigneeEmail == null || assigneeEmail.isBlank()) {
            return null;
        }

        UserEntity user = userRepository.findByEmail(assigneeEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + assigneeEmail));

        boolean isMember = project.getMembers().stream().anyMatch(member -> member.getEmail().equalsIgnoreCase(assigneeEmail));
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignee must be a member of the project");
        }

        return user;
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
