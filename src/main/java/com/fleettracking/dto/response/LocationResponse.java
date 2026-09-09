package com.fleettracking.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {
    private Long id;
    private Double latitude;
    private Double longitude;
    private LocalDateTime recordedAt;
}
