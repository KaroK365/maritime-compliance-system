package com.ansh.backend.service;

import com.ansh.backend.dto.ComplianceDashboardResponse;
import com.ansh.backend.entity.*;
import com.ansh.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplianceService {

    private final MaintenanceTaskRepository taskRepository;
    private final SafetyDrillRepository drillRepository;
    private final DrillParticipationRepository participationRepository;

    public void updateOverdueTasks() {

        List<MaintenanceTask> tasks =
                taskRepository.findAll();

        for (MaintenanceTask task : tasks) {

            if (task.getDueDate().isBefore(LocalDate.now())
                    && task.getStatus() != MaintenanceStatus.COMPLETED
                    && task.getStatus() != MaintenanceStatus.OVERDUE) {

                task.setStatus(MaintenanceStatus.OVERDUE);

                taskRepository.save(task);
            }
        }
    }

    public void updateMissedDrills() {

        List<SafetyDrill> drills =
                drillRepository.findAll();

        for (SafetyDrill drill : drills) {

            boolean hasAttendance =
                    participationRepository.findAll()
                            .stream()
                            .anyMatch(participation ->
                                    participation.getDrill()
                                            .getId()
                                            .equals(drill.getId())
                            );

            if (drill.getScheduledDate()
                    .isBefore(LocalDate.now())
                    && !hasAttendance
                    && drill.getStatus() != DrillStatus.MISSED) {

                drill.setStatus(DrillStatus.MISSED);

                drillRepository.save(drill);
            }
        }
    }

    public ComplianceDashboardResponse getDashboard() {

        long totalTasks = taskRepository.count();

        long completedTasks =
                taskRepository.countByStatus(
                        MaintenanceStatus.COMPLETED
                );

        long overdueTasks =
                taskRepository.countByStatus(
                        MaintenanceStatus.OVERDUE
                );

        double maintenanceRate =
                totalTasks == 0
                        ? 0
                        : ((double) completedTasks / totalTasks) * 100;

        long totalDrills = drillRepository.count();

        long completedDrills =
                participationRepository.findAll()
                        .stream()
                        .filter(DrillParticipation::getAttended)
                        .count();

        long missedDrills =
                drillRepository.countByStatus(
                        DrillStatus.MISSED
                );

        double drillRate =
                totalDrills == 0
                        ? 0
                        : ((double) completedDrills / totalDrills) * 100;

        double overall =
                (maintenanceRate + drillRate) / 2;

        return ComplianceDashboardResponse.builder()
                .maintenanceCompletionRate(maintenanceRate)
                .drillParticipationRate(drillRate)
                .overallCompliance(overall)
                .overdueTasks(overdueTasks)
                .missedDrills(missedDrills)
                .build();
    }

    @Scheduled(cron = "0 0 * * * *")
    public void complianceScheduler() {

        updateOverdueTasks();

        updateMissedDrills();

        System.out.println(
                "Compliance scheduler executed"
        );
    }
}