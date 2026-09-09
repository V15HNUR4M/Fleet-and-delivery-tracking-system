package com.fleettracking.service.impl;

import com.fleettracking.dto.request.OrderAssignRequest;
import com.fleettracking.dto.request.OrderRequest;
import com.fleettracking.dto.request.OrderStatusUpdateRequest;
import com.fleettracking.dto.response.OrderResponse;
import com.fleettracking.dto.response.OrderStatusHistoryResponse;
import com.fleettracking.entity.Driver;
import com.fleettracking.entity.Order;
import com.fleettracking.entity.OrderStatusHistory;
import com.fleettracking.entity.User;
import com.fleettracking.entity.Vehicle;
import com.fleettracking.enums.DriverAvailability;
import com.fleettracking.enums.OrderStatus;
import com.fleettracking.exception.CapacityExceededException;
import com.fleettracking.exception.DriverNotAvailableException;
import com.fleettracking.exception.InvalidStateTransitionException;
import com.fleettracking.exception.MaxRetryExceededException;
import com.fleettracking.exception.ResourceNotFoundException;
import com.fleettracking.repository.DriverRepository;
import com.fleettracking.repository.OrderRepository;
import com.fleettracking.repository.UserRepository;
import com.fleettracking.repository.VehicleRepository;
import com.fleettracking.service.OrderService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            UserRepository userRepository,
                            DriverRepository driverRepository,
                            VehicleRepository vehicleRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public OrderResponse createOrder(OrderRequest request, Long customerId) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));

        LocalDateTime slaDeadline = OffsetDateTime.parse(request.getSlaDeadline()).toLocalDateTime();
        if (!slaDeadline.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("SLA deadline must be in the future");
        }

        Order order = Order.builder()
                .orderRef(String.format("ORD-%06d", System.currentTimeMillis() % 1000000))
                .customer(customer)
                .pickupAddress(request.getPickupAddress())
                .deliveryAddress(request.getDeliveryAddress())
                .weightKg(request.getWeightKg())
                .codAmount(request.getCodAmount())
                .slaDeadline(slaDeadline)
                .status(OrderStatus.CREATED)
                .attemptCount(0)
                .build();

        order = orderRepository.save(order);
        return toResponse(order);
    }

    @Override
    public com.fleettracking.dto.response.PageResponse<OrderResponse> listOrders(String status, Long driverId, Pageable pageable) {
        Page<Order> orders;
        if (status == null || status.isBlank()) {
            if (driverId == null) {
                orders = orderRepository.findAll(pageable);
            } else {
                orders = orderRepository.findByDriverId(driverId, pageable);
            }
        } else {
            OrderStatus orderStatus = OrderStatus.valueOf(status);
            if (driverId == null) {
                orders = orderRepository.findByStatus(orderStatus, pageable);
            } else {
                orders = orderRepository.findByStatusAndDriverId(orderStatus, driverId, pageable);
            }
        }

        return com.fleettracking.dto.response.PageResponse.<OrderResponse>builder()
                .content(orders.map(this::toResponse).getContent())
                .totalElements(orders.getTotalElements())
                .page(orders.getNumber())
                .build();
    }

    @Override
    public OrderResponse getOrder(Long orderId, Long currentUserId, String currentUserRole) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if ("DRIVER" .equalsIgnoreCase(currentUserRole)) {
            if (order.getDriver() == null || !order.getDriver().getId().equals(currentUserId)) {
                throw new IllegalArgumentException("Access denied");
            }
        }
        if ("CUSTOMER" .equalsIgnoreCase(currentUserRole)) {
            if (!order.getCustomer().getId().equals(currentUserId)) {
                throw new IllegalArgumentException("Access denied");
            }
        }

        return toResponse(order);
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, Long currentUserId, String currentUserRole) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        OrderStatus nextStatus = OrderStatus.valueOf(request.getNewStatus());
        validateTransition(order.getStatus(), nextStatus, order);

        if ("DRIVER".equalsIgnoreCase(currentUserRole) && order.getDriver() != null && !order.getDriver().getId().equals(currentUserId)) {
            throw new IllegalArgumentException("Access denied");
        }

        order.setStatus(nextStatus);
        addStatusHistory(order, order.getStatus().name(), nextStatus.name(), currentUserId, request.getReason());
        return toResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse assignOrder(Long orderId, OrderAssignRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Driver driver = request.getDriverId() == null
                ? driverRepository.findFirstByAvailability(DriverAvailability.AVAILABLE)
                .orElseThrow(() -> new DriverNotAvailableException("No available driver found"))
                : driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        if (Boolean.TRUE.equals(driver.getIsSuspended()) || driver.getAvailability() != DriverAvailability.AVAILABLE) {
            throw new DriverNotAvailableException("Driver not available for assignment");
        }

        Vehicle vehicle = request.getVehicleId() == null
                ? vehicleRepository.findFirstByStatus(com.fleettracking.enums.VehicleStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No available vehicle found"))
                : vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (vehicle.getCapacityKg().compareTo(order.getWeightKg()) < 0) {
            throw new CapacityExceededException("Selected vehicle cannot carry the order weight");
        }

        order.setDriver(driver);
        order.setVehicle(vehicle);
        order.setStatus(OrderStatus.ASSIGNED);
        addStatusHistory(order, order.getStatus().name(), OrderStatus.ASSIGNED.name(), null, "Assigned by dispatcher");
        driver.setAvailability(DriverAvailability.ON_DUTY);
        return toResponse(orderRepository.save(order));
    }

    private void validateTransition(OrderStatus current, OrderStatus next, Order order) {
        if (current == next) {
            return;
        }
        switch (current) {
            case CREATED -> {
                if (next != OrderStatus.ASSIGNED && next != OrderStatus.CANCELLED) {
                    throw new InvalidStateTransitionException("Invalid transition from CREATED");
                }
            }
            case ASSIGNED -> {
                if (next != OrderStatus.PICKED_UP && next != OrderStatus.CANCELLED) {
                    throw new InvalidStateTransitionException("Invalid transition from ASSIGNED");
                }
            }
            case PICKED_UP -> {
                if (next != OrderStatus.IN_TRANSIT) {
                    throw new InvalidStateTransitionException("Invalid transition from PICKED_UP");
                }
            }
            case IN_TRANSIT -> {
                if (next != OrderStatus.DELIVERED && next != OrderStatus.FAILED) {
                    throw new InvalidStateTransitionException("Invalid transition from IN_TRANSIT");
                }
            }
            case FAILED -> {
                if (next == OrderStatus.RE_ATTEMPT && order.getAttemptCount() < 3) {
                    order.setAttemptCount(order.getAttemptCount() + 1);
                } else if (order.getAttemptCount() >= 3 || next == OrderStatus.RTO) {
                    order.setStatus(OrderStatus.RTO);
                    throw new MaxRetryExceededException("Maximum retry attempts exceeded, order marked for RTO");
                } else {
                    throw new InvalidStateTransitionException("Invalid transition from FAILED");
                }
            }
            default -> throw new InvalidStateTransitionException("Transition not allowed from current state");
        }
    }

    private void addStatusHistory(Order order, String previousStatus, String newStatus, Long changedBy, String reason) {
        OrderStatusHistory history = OrderStatusHistory.builder()
                .order(order)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .changedBy(changedBy == null ? null : userRepository.findById(changedBy).orElse(null))
                .reason(reason)
                .build();
        order.getStatusHistory().add(history);
    }

    private OrderResponse toResponse(Order order) {
        List<OrderStatusHistoryResponse> historyResponses = order.getStatusHistory().stream()
                .map(history -> OrderStatusHistoryResponse.builder()
                        .previousStatus(history.getPreviousStatus())
                        .newStatus(history.getNewStatus())
                        .changedBy(history.getChangedBy() == null ? null : history.getChangedBy().getId())
                        .reason(history.getReason())
                        .changedAt(history.getChangedAt())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .orderRef(order.getOrderRef())
                .customerId(order.getCustomer().getId())
                .pickupAddress(order.getPickupAddress())
                .deliveryAddress(order.getDeliveryAddress())
                .weightKg(order.getWeightKg())
                .codAmount(order.getCodAmount())
                .slaDeadline(order.getSlaDeadline())
                .status(order.getStatus().name())
                .driverId(order.getDriver() == null ? null : order.getDriver().getId())
                .vehicleId(order.getVehicle() == null ? null : order.getVehicle().getId())
                .attemptCount(order.getAttemptCount())
                .notes(order.getNotes())
                .statusHistory(historyResponses)
                .build();
    }
}
