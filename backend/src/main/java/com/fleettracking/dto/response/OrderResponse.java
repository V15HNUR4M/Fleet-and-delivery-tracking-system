package com.fleettracking.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private String orderRef;
    private Long customerId;
    private String pickupAddress;
    private String deliveryAddress;
    private BigDecimal weightKg;
    private BigDecimal codAmount;
    private LocalDateTime slaDeadline;
    private String status;
    private Long driverId;
    private Long vehicleId;
    private Integer attemptCount;
    private String notes;
    private List<OrderStatusHistoryResponse> statusHistory;
}
