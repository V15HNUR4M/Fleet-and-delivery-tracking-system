package com.fleettracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRequest {

    @NotBlank
    private String name;

    @NotBlank
    @Pattern(regexp = "^\\d{10,15}$")
    private String mobile;

    @NotBlank
    private String licenseNumber;

    @NotBlank
    private String licenseExpiry;
}
