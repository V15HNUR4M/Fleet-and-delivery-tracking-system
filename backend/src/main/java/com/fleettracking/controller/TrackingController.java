package com.fleettracking.controller;

import com.fleettracking.dto.request.LocationRequest;
import com.fleettracking.dto.response.LocationResponse;
import com.fleettracking.security.UserPrincipal;
import com.fleettracking.service.TrackingService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    @PostMapping("/locations")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<LocationResponse> addLocation(
            @Valid @RequestBody LocationRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (!request.getDriverId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Drivers can only add their own locations");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(trackingService.addLocation(request));
    }

    @GetMapping("/drivers/{id}/locations")
    @PreAuthorize("hasAnyRole('ADMIN','DISPATCHER','DRIVER')")
    public ResponseEntity<List<LocationResponse>> getLocations(
            @PathVariable Long id,
            @RequestParam String from,
            @RequestParam String to,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if ("DRIVER".equalsIgnoreCase(getRole(currentUser)) && !currentUser.getId().equals(id)) {
            throw new IllegalArgumentException("Drivers can only view their own locations");
        }
        LocalDateTime fromDate = OffsetDateTime.parse(from).toLocalDateTime();
        LocalDateTime toDate = OffsetDateTime.parse(to).toLocalDateTime();
        return ResponseEntity.ok(trackingService.getDriverLocations(id, fromDate, toDate));
    }

    private String getRole(UserPrincipal user) {
        return user.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");
    }
}
