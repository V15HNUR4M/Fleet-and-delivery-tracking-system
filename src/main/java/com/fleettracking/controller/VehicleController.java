package com.fleettracking.controller;

import com.fleettracking.dto.request.VehicleRequest;
import com.fleettracking.dto.request.VehicleStatusUpdateRequest;
import com.fleettracking.dto.response.PageResponse;
import com.fleettracking.dto.response.VehicleResponse;
import com.fleettracking.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/vehicles")
@PreAuthorize("hasAnyRole('ADMIN','DISPATCHER')")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.createVehicle(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<VehicleResponse>> listVehicles(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(vehicleService.listVehicles(status, pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id,
            @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VehicleResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody VehicleStatusUpdateRequest request) {
        return ResponseEntity.ok(vehicleService.updateStatus(id, request.getStatus()));
    }
}
