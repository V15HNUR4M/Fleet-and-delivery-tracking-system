package com.fleettracking.service.impl;

import com.fleettracking.dto.request.VehicleRequest;
import com.fleettracking.dto.response.PageResponse;
import com.fleettracking.dto.response.VehicleResponse;
import com.fleettracking.entity.Vehicle;
import com.fleettracking.enums.VehicleStatus;
import com.fleettracking.repository.VehicleRepository;
import com.fleettracking.service.VehicleService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleServiceImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .regNumber(request.getRegNumber())
                .type(request.getType())
                .capacityKg(request.getCapacityKg())
                .fuelType(request.getFuelType())
                .status(request.getStatus() == null ? VehicleStatus.ACTIVE : VehicleStatus.valueOf(request.getStatus()))
                .build();
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    @Override
    public PageResponse<VehicleResponse> listVehicles(String status, Pageable pageable) {
        Page<Vehicle> vehicles;
        if (status == null || status.isBlank()) {
            vehicles = vehicleRepository.findAll(pageable);
        } else {
            vehicles = vehicleRepository.findByStatus(VehicleStatus.valueOf(status), pageable);
        }
        return PageResponse.<VehicleResponse>builder()
                .content(vehicles.map(this::toResponse).getContent())
                .totalElements(vehicles.getTotalElements())
                .page(vehicles.getNumber())
                .build();
    }

    @Override
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicle.setRegNumber(request.getRegNumber());
        vehicle.setType(request.getType());
        vehicle.setCapacityKg(request.getCapacityKg());
        vehicle.setFuelType(request.getFuelType());
        if (request.getStatus() != null) {
            vehicle.setStatus(VehicleStatus.valueOf(request.getStatus()));
        }
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    @Override
    public VehicleResponse updateStatus(Long id, String status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicle.setStatus(VehicleStatus.valueOf(status));
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle);
    }

    private VehicleResponse toResponse(Vehicle vehicle) {
        return VehicleResponse.builder()
                .id(vehicle.getId())
                .regNumber(vehicle.getRegNumber())
                .type(vehicle.getType())
                .capacityKg(vehicle.getCapacityKg())
                .fuelType(vehicle.getFuelType())
                .status(vehicle.getStatus().name())
                .build();
    }
}
