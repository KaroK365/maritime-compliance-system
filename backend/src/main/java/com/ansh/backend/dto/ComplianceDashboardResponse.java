package com.ansh.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ComplianceDashboardResponse {

    private double maintenanceCompletionRate;

    private double drillParticipationRate;

    private double overallCompliance;

    private long overdueTasks;

    private long missedDrills;
}