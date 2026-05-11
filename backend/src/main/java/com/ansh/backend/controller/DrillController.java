package com.ansh.backend.controller;

import com.ansh.backend.dto.CreateDrillRequest;
import com.ansh.backend.dto.DrillAttendanceRequest;
import com.ansh.backend.entity.DrillParticipation;
import com.ansh.backend.entity.SafetyDrill;
import com.ansh.backend.service.DrillService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drills")
@RequiredArgsConstructor
public class DrillController {

    private final DrillService drillService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public SafetyDrill createDrill(
            @RequestBody CreateDrillRequest request
    ) {

        return drillService.createDrill(request);
    }

    @GetMapping
    public List<SafetyDrill> getAllDrills() {
        return drillService.getAllDrills();
    }

    @PostMapping("/{id}/attendance")
    @PreAuthorize("hasRole('CREW')")
    public DrillParticipation markAttendance(
            @PathVariable Long id,
            @RequestBody DrillAttendanceRequest request,
            Authentication authentication
    ) {

        return drillService.markAttendance(
                id,
                request,
                authentication
        );
    }
}