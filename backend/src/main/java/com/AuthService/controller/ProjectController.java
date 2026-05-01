package com.AuthService.controller;

import com.AuthService.io.ProjectCreateRequest;
import com.AuthService.io.ProjectMemberRequest;
import com.AuthService.io.ProjectResponse;
import com.AuthService.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse createProject(@Valid @RequestBody ProjectCreateRequest request) {
        return projectService.createProject(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public List<ProjectResponse> getProjects() {
        return projectService.getProjectsForCurrentUser();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    public ProjectResponse getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse addMember(@PathVariable Long id, @Valid @RequestBody ProjectMemberRequest request) {
        return projectService.addMember(id, request.getEmail());
    }

    @DeleteMapping("/{id}/members")
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse removeMember(@PathVariable Long id, @Valid @RequestBody ProjectMemberRequest request) {
        return projectService.removeMember(id, request.getEmail());
    }
}
