package com.ansh.backend.repository;

import com.ansh.backend.entity.DrillStatus;
import com.ansh.backend.entity.SafetyDrill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SafetyDrillRepository extends JpaRepository<SafetyDrill, Long> {
    long countByStatus(DrillStatus status);
}
