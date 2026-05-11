package com.ansh.backend.dto;

import com.ansh.backend.entity.MaintenanceStatus;
import lombok.Data;

@Data
public class UpdateMaintenanceStatusRequest {

    private MaintenanceStatus status;

    private String notes;
}