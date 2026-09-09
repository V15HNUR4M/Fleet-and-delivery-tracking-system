package com.fleettracking.service;

import com.fleettracking.dto.request.VehicleRequest;
import com.fleettracking.dto.response.PageResponse;
import com.fleettracking.dto.response.VehicleResponse;
import org.springframework.data.domain.Pageable;

public interface VehicleService {

    VehicleResponse createVehicle(VehicleRequest request);

    PageResponse<VehicleResponse> listVehicles(String status, Pageable pageable);

    VehicleResponse updateVehicle(Long id, VehicleRequest request);

    VehicleResponse updateStatus(Long id, String status);
}
