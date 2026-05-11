package com.ansh.backend.repository;

import com.ansh.backend.entity.Ship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipRepository extends JpaRepository<Ship, Long> {
}
