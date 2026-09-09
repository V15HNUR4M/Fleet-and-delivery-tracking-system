package com.fleettracking.service;

import com.fleettracking.dto.request.DriverRequest;
import com.fleettracking.dto.response.DriverResponse;
import com.fleettracking.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface DriverService {

    DriverResponse createDriver(DriverRequest request);

    PageResponse<DriverResponse> listDrivers(String availability, Pageable pageable);

    DriverResponse updateAvailability(Long id, String availability);
}
