package com.ansh.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateDrillRequest {

    private String title;

    private String type;

    private LocalDate scheduledDate;

    private Long shipId;
}