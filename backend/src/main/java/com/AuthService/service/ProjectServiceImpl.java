package com.AuthService.service;

import com.AuthService.entity.ProjectEntity;
import com.AuthService.entity.UserEntity;
import com.AuthService.io.ProjectCreateRequest;
import com.AuthService.io.ProjectResponse;
import com.AuthService.repository.ProjectRepository;
import com.AuthService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    public ProjectResponse createProject(ProjectCreateRequest request) {
        UserEntity currentUser = currentUserService.getCurrentUser();

        ProjectEntity project = ProjectEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .createdBy(currentUser)
                .build();

        project.getMembers().add(currentUser);

        if (request.getMemberEmails() != null) {
            for (String email : request.getMemberEmails()) {
                UserEntity member = userRepository.findByEmail(email)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + email));
                project.getMembers().add(member);
            }
        }

        ProjectEntity saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Override
    public List<ProjectResponse> getProjectsForCurrentUser() {
        String email = currentUserService.getCurrentEmail();
        return projectRepository.findAccessibleProjects(email)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProjectResponse getProjectById(Long id) {
        String email = currentUserService.getCurrentEmail();

        if (!projectRepository.hasProjectAccess(id, email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this project");
        }

        ProjectEntity project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        return toResponse(project);
    }

    @Override
    public void deleteProject(Long id) {
        ProjectEntity project = projectRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
        projectRepository.delete(project);
    }

    @Override
    public ProjectResponse addMember(Long projectId, String email) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        UserEntity member = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + email));

        project.getMembers().add(member);
        ProjectEntity saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Override
    public ProjectResponse removeMember(Long projectId, String email) {
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));

        List<UserEntity> removableMembers = new ArrayList<>();
        for (UserEntity member : project.getMembers()) {
            if (member.getEmail().equalsIgnoreCase(email) && !member.getEmail().equalsIgnoreCase(project.getCreatedBy().getEmail())) {
                removableMembers.add(member);
            }
        }

        project.getMembers().removeAll(removableMembers);
        ProjectEntity saved = projectRepository.save(project);
        return toResponse(saved);
    }

    private ProjectResponse toResponse(ProjectEntity project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .createdBy(project.getCreatedBy().getEmail())
                .members(project.getMembers().stream().map(UserEntity::getEmail).sorted().collect(Collectors.toList()))
                .build();
    }
}
