package com.ansh.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMaintenanceTaskRequest {

    private String title;

    private String description;

    private LocalDate dueDate;

    private Long assignedCrewId;

    private Long shipId;
}