package com.AuthService.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.AuthService.entity.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    @Query("select distinct p from ProjectEntity p left join p.members m where p.createdBy.email = :email or m.email = :email")
    List<ProjectEntity> findAccessibleProjects(String email);

    @Query("select (count(p) > 0) from ProjectEntity p left join p.members m where p.id = :projectId and (p.createdBy.email = :email or m.email = :email)")
    boolean hasProjectAccess(Long projectId, String email);
}
