package com.ansh.backend.controller;

import com.ansh.backend.dto.ComplianceDashboardResponse;
import com.ansh.backend.service.ComplianceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ComplianceService complianceService;

    @GetMapping("/compliance")
    public ComplianceDashboardResponse getDashboard() {

        return complianceService.getDashboard();
    }
    @PostMapping("/update-overdue")
    public String updateOverdueTasks() {
        complianceService.updateOverdueTasks();
        return "Overdue tasks update manually triggered and executed.";
    }
}