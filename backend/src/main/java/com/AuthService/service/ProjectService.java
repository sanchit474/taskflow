package com.AuthService.service;

import com.AuthService.io.ProjectCreateRequest;
import com.AuthService.io.ProjectResponse;

import java.util.List;

public interface ProjectService {

    ProjectResponse createProject(ProjectCreateRequest request);

    List<ProjectResponse> getProjectsForCurrentUser();

    ProjectResponse getProjectById(Long id);

    void deleteProject(Long id);

    ProjectResponse addMember(Long projectId, String email);

    ProjectResponse removeMember(Long projectId, String email);
}
