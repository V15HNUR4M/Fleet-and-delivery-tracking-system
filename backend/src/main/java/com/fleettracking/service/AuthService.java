package com.fleettracking.service;

import com.fleettracking.dto.request.LoginRequest;
import com.fleettracking.dto.request.RegisterRequest;
import com.fleettracking.dto.response.AuthResponse;
import com.fleettracking.dto.response.RegisterResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    RegisterResponse register(RegisterRequest request);
}
