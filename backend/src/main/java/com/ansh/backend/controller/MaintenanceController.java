package com.ansh.backend.controller;

import com.ansh.backend.dto.CreateMaintenanceTaskRequest;
import com.ansh.backend.dto.UpdateMaintenanceStatusRequest;
import com.ansh.backend.entity.MaintenanceTask;
import com.ansh.backend.service.MaintenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MaintenanceTask createTask(
            @RequestBody CreateMaintenanceTaskRequest request
    ) {

        return maintenanceService.createTask(request);
    }

    @GetMapping
    public List<MaintenanceTask> getAllTasks() {

        return maintenanceService.getAllTasks();
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('CREW')")
    public MaintenanceTask updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateMaintenanceStatusRequest request
    ) {

        return maintenanceService.updateTaskStatus(id, request);
    }
}