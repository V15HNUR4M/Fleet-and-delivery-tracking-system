package com.fleettracking.service.impl;

import com.fleettracking.dto.request.LocationRequest;
import com.fleettracking.dto.response.LocationResponse;
import com.fleettracking.entity.Driver;
import com.fleettracking.entity.Location;
import com.fleettracking.entity.Order;
import com.fleettracking.exception.ResourceNotFoundException;
import com.fleettracking.repository.DriverRepository;
import com.fleettracking.repository.LocationRepository;
import com.fleettracking.repository.OrderRepository;
import com.fleettracking.service.TrackingService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TrackingServiceImpl implements TrackingService {

    private final DriverRepository driverRepository;
    private final OrderRepository orderRepository;
    private final LocationRepository locationRepository;

    public TrackingServiceImpl(DriverRepository driverRepository,
                               OrderRepository orderRepository,
                               LocationRepository locationRepository) {
        this.driverRepository = driverRepository;
        this.orderRepository = orderRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public LocationResponse addLocation(LocationRequest request) {
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        Order order = null;
        if (request.getOrderId() != null) {
            order = orderRepository.findById(request.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        }

        Location location = Location.builder()
                .driver(driver)
                .order(order)
                .latitude(java.math.BigDecimal.valueOf(request.getLatitude()))
                .longitude(java.math.BigDecimal.valueOf(request.getLongitude()))
                .build();

        location = locationRepository.save(location);
        return LocationResponse.builder()
                .id(location.getId())
                .latitude(location.getLatitude().doubleValue())
                .longitude(location.getLongitude().doubleValue())
                .recordedAt(location.getRecordedAt())
                .build();
    }

    @Override
    public List<LocationResponse> getDriverLocations(Long driverId, LocalDateTime from, LocalDateTime to) {
        driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        return locationRepository.findByDriverIdAndRecordedAtBetween(driverId, from, to).stream()
                .map(location -> LocationResponse.builder()
                        .id(location.getId())
                        .latitude(location.getLatitude().doubleValue())
                        .longitude(location.getLongitude().doubleValue())
                        .recordedAt(location.getRecordedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
