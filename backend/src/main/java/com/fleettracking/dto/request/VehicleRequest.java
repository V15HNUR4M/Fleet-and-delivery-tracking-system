package com.fleettracking.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleRequest {

    @NotBlank
    private String regNumber;

    @NotBlank
    private String type;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal capacityKg;

    private String fuelType;

    private String status;
}
