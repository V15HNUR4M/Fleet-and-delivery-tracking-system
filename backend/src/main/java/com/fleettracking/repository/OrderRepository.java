package com.fleettracking.repository;

import com.fleettracking.entity.Order;
import com.fleettracking.enums.OrderStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderRef(String orderRef);
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    Page<Order> findByStatusAndDriverId(OrderStatus status, Long driverId, Pageable pageable);
    Page<Order> findByDriverId(Long driverId, Pageable pageable);
}
