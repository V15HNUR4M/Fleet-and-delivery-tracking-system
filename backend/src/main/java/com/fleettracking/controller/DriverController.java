package com.fleettracking.controller;

import com.fleettracking.dto.request.DriverAvailabilityUpdateRequest;
import com.fleettracking.dto.request.DriverRequest;
import com.fleettracking.dto.response.DriverResponse;
import com.fleettracking.dto.response.PageResponse;
import com.fleettracking.service.DriverService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/drivers")
@PreAuthorize("hasAnyRole('ADMIN','DISPATCHER')")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    public ResponseEntity<DriverResponse> createDriver(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.createDriver(request));
    }

    @GetMapping
    public ResponseEntity<PageResponse<DriverResponse>> listDrivers(
            @RequestParam(required = false) String availability,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(driverService.listDrivers(availability, pageable));
    }

    @PatchMapping("/{id}/availability")
    public ResponseEntity<DriverResponse> updateAvailability(
            @PathVariable Long id,
            @Valid @RequestBody DriverAvailabilityUpdateRequest request) {
        return ResponseEntity.ok(driverService.updateAvailability(id, request.getAvailability()));
    }
}
