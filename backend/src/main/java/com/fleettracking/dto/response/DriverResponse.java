package com.fleettracking.dto.response;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverResponse {
    private Long id;
    private String name;
    private String mobile;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String availability;
    private Boolean isSuspended;
}
