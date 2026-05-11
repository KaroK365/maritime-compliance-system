package com.ansh.backend.repository;

import com.ansh.backend.entity.DrillParticipation;
import com.ansh.backend.entity.SafetyDrill;
import com.ansh.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DrillParticipationRepository extends JpaRepository<DrillParticipation, Integer> {
    Optional<DrillParticipation> findByDrillAndCrew(SafetyDrill drill, User crew);
}
