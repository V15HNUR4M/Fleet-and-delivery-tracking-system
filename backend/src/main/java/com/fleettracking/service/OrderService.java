package com.fleettracking.service;

import com.fleettracking.dto.request.OrderAssignRequest;
import com.fleettracking.dto.request.OrderRequest;
import com.fleettracking.dto.request.OrderStatusUpdateRequest;
import com.fleettracking.dto.response.OrderResponse;
import com.fleettracking.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    OrderResponse createOrder(OrderRequest request, Long customerId);

    PageResponse<OrderResponse> listOrders(String status, Long driverId, Pageable pageable);

    OrderResponse getOrder(Long orderId, Long currentUserId, String currentUserRole);

    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, Long currentUserId, String currentUserRole);

    OrderResponse assignOrder(Long orderId, OrderAssignRequest request);
}
