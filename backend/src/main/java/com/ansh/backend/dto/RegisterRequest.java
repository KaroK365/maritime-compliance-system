package com.ansh.backend.dto;

import com.ansh.backend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private Role role;
}