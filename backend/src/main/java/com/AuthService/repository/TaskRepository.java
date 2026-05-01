package com.AuthService.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.AuthService.entity.TaskEntity;
import com.AuthService.entity.TaskStatus;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findByProjectId(Long projectId);

    List<TaskEntity> findByAssignedToEmail(String email);

    List<TaskEntity> findByDueDateBeforeAndStatusNot(LocalDate date, TaskStatus status);

    @Query("select t.status, count(t) from TaskEntity t group by t.status")
    List<Object[]> countByStatus();
}
