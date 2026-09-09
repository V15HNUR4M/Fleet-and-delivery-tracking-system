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
public class OrderStatusHistoryResponse {
    private String previousStatus;
    private String newStatus;
    private Long changedBy;
    private String reason;
    private LocalDateTime changedAt;
}
