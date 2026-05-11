package com.ansh.backend.service;

import com.ansh.backend.dto.CreateDrillRequest;
import com.ansh.backend.dto.DrillAttendanceRequest;
import com.ansh.backend.entity.*;
import com.ansh.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DrillService {

    private final SafetyDrillRepository drillRepository;
    private final ShipRepository shipRepository;
    private final UserRepository userRepository;
    private final DrillParticipationRepository participationRepository;

    public SafetyDrill createDrill(
            CreateDrillRequest request
    ) {

        Ship ship = shipRepository.findById(
                request.getShipId()
        ).orElseThrow(() ->
                new RuntimeException("Ship not found"));

        SafetyDrill drill = SafetyDrill.builder()
                .title(request.getTitle())
                .type(request.getType())
                .scheduledDate(request.getScheduledDate())
                .status(DrillStatus.SCHEDULED)
                .ship(ship)
                .build();

        return drillRepository.save(drill);
    }

    public DrillParticipation markAttendance(
            Long drillId,
            DrillAttendanceRequest request,
            Authentication authentication
    ) {

        SafetyDrill drill = drillRepository.findById(drillId)
                .orElseThrow(() ->
                        new RuntimeException("Drill not found"));

        String email = authentication.getName();

        User crew = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Update existing record if found, else create new
        DrillParticipation participation = participationRepository
                .findByDrillAndCrew(drill, crew)
                .orElse(DrillParticipation.builder()
                        .drill(drill)
                        .crew(crew)
                        .build());

        participation.setAttended(request.getAttended());
        participation.setSubmittedAt(LocalDateTime.now());

        // Update drill status based on attendance
        if (request.getAttended()) {
            drill.setStatus(DrillStatus.COMPLETED);
            drillRepository.save(drill);
        }

        return participationRepository.save(participation);
    }

    public List<SafetyDrill> getAllDrills() {
        return drillRepository.findAll();
    }
}