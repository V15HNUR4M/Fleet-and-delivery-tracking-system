package com.fleettracking.service.impl;

import com.fleettracking.dto.request.DriverRequest;
import com.fleettracking.dto.response.DriverResponse;
import com.fleettracking.dto.response.PageResponse;
import com.fleettracking.entity.Driver;
import com.fleettracking.entity.Role;
import com.fleettracking.entity.User;
import com.fleettracking.enums.DriverAvailability;
import com.fleettracking.enums.RoleType;
import com.fleettracking.exception.ResourceNotFoundException;
import com.fleettracking.repository.DriverRepository;
import com.fleettracking.repository.RoleRepository;
import com.fleettracking.repository.UserRepository;
import com.fleettracking.service.DriverService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public DriverServiceImpl(DriverRepository driverRepository,
                             UserRepository userRepository,
                             RoleRepository roleRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public DriverResponse createDriver(DriverRequest request) {
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new IllegalArgumentException("Mobile number already exists");
        }

        Role role = roleRepository.findByName(RoleType.DRIVER)
                .orElseThrow(() -> new ResourceNotFoundException("Driver role not configured"));

        User user = User.builder()
                .mobile(request.getMobile())
                .passwordHash(null)
                .role(role)
                .isActive(true)
                .build();

        user = userRepository.save(user);

        Driver driver = Driver.builder()
                .user(user)
                .name(request.getName())
                .mobile(request.getMobile())
                .licenseNumber(request.getLicenseNumber())
                .licenseExpiry(java.time.LocalDate.parse(request.getLicenseExpiry()))
                .availability(DriverAvailability.OFF_DUTY)
                .isSuspended(false)
                .build();

        driver = driverRepository.save(driver);
        return toResponse(driver);
    }

    @Override
    public PageResponse<DriverResponse> listDrivers(String availability, Pageable pageable) {
        Page<Driver> drivers;
        if (availability == null || availability.isBlank()) {
            drivers = driverRepository.findAll(pageable);
        } else {
            drivers = driverRepository.findByAvailability(DriverAvailability.valueOf(availability), pageable);
        }
        return PageResponse.<DriverResponse>builder()
                .content(drivers.map(this::toResponse).getContent())
                .totalElements(drivers.getTotalElements())
                .page(drivers.getNumber())
                .build();
    }

    @Override
    public DriverResponse updateAvailability(Long id, String availability) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        if (Boolean.TRUE.equals(driver.getIsSuspended())) {
            throw new IllegalArgumentException("Cannot change availability for suspended driver");
        }
        driver.setAvailability(DriverAvailability.valueOf(availability));
        driver = driverRepository.save(driver);
        return toResponse(driver);
    }

    private DriverResponse toResponse(Driver driver) {
        return DriverResponse.builder()
                .id(driver.getId())
                .name(driver.getName())
                .mobile(driver.getMobile())
                .licenseNumber(driver.getLicenseNumber())
                .licenseExpiry(driver.getLicenseExpiry())
                .availability(driver.getAvailability().name())
                .isSuspended(driver.getIsSuspended())
                .build();
    }
}
