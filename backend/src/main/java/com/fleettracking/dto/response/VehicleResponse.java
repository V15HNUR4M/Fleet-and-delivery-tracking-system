package com.fleettracking.dto.response;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleResponse {
    private Long id;
    private String regNumber;
    private String type;
    private BigDecimal capacityKg;
    private String fuelType;
    private String status;
}
