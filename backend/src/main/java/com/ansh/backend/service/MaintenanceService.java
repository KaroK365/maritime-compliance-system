package com.ansh.backend.service;

import com.ansh.backend.dto.CreateMaintenanceTaskRequest;
import com.ansh.backend.dto.UpdateMaintenanceStatusRequest;
import com.ansh.backend.entity.*;
import com.ansh.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private final MaintenanceTaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ShipRepository shipRepository;

    public MaintenanceTask createTask(
            CreateMaintenanceTaskRequest request
    ) {

        User crew = userRepository.findById(
                request.getAssignedCrewId()
        ).orElseThrow(() ->
                new RuntimeException("Crew not found"));

        Ship ship = shipRepository.findById(
                request.getShipId()
        ).orElseThrow(() ->
                new RuntimeException("Ship not found"));

        MaintenanceTask task = MaintenanceTask.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(MaintenanceStatus.PENDING)
                .assignedCrew(crew)
                .ship(ship)
                .build();

        return taskRepository.save(task);
    }

    public List<MaintenanceTask> getAllTasks() {
        return taskRepository.findAll();
    }

    public MaintenanceTask updateTaskStatus(
            Long taskId,
            UpdateMaintenanceStatusRequest request
    ) {

        MaintenanceTask task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new RuntimeException("Task not found"));

        task.setStatus(request.getStatus());
        task.setNotes(request.getNotes());

        if (request.getStatus() ==
                MaintenanceStatus.COMPLETED) {

            task.setCompletedAt(LocalDateTime.now());
        }

        return taskRepository.save(task);
    }
}