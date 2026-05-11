package com.ansh.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    private MaintenanceStatus status;

    private String notes;

    private LocalDateTime completedAt;

    @ManyToOne
    @JoinColumn(name = "assigned_crew_id")
    private User assignedCrew;

    @ManyToOne
    @JoinColumn(name = "ship_id")
    private Ship ship;
}