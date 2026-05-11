package com.ansh.backend.repository;

import com.ansh.backend.entity.MaintenanceStatus;
import com.ansh.backend.entity.MaintenanceTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceTaskRepository extends JpaRepository<MaintenanceTask, Long> {
    List<MaintenanceTask> findByAssignedCrewId(Long crewId);
    long countByStatus(MaintenanceStatus status);
}
