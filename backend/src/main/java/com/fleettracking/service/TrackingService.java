package com.fleettracking.service;

import com.fleettracking.dto.request.LocationRequest;
import com.fleettracking.dto.response.LocationResponse;
import java.time.LocalDateTime;
import java.util.List;

public interface TrackingService {

    LocationResponse addLocation(LocationRequest request);

    List<LocationResponse> getDriverLocations(Long driverId, LocalDateTime from, LocalDateTime to);
}
