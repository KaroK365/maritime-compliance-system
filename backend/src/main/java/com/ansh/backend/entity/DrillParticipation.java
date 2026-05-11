package com.ansh.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrillParticipation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Boolean attended;

    private LocalDateTime submittedAt;

    @ManyToOne
    @JoinColumn(name = "drill_id")
    private SafetyDrill drill;

    @ManyToOne
    @JoinColumn(name = "crew_id")
    private User crew;
}