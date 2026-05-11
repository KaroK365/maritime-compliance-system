package com.ansh.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafetyDrill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String type;

    private LocalDate scheduledDate;

    @Enumerated(EnumType.STRING)
    private DrillStatus status;

    @ManyToOne
    @JoinColumn(name = "ship_id")
    private Ship ship;
}