package com.fleettracking.repository;

import com.fleettracking.entity.Vehicle;
import com.fleettracking.enums.VehicleStatus;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByRegNumber(String regNumber);
    Page<Vehicle> findByStatus(VehicleStatus status, Pageable pageable);
    Optional<Vehicle> findFirstByStatus(VehicleStatus status);
}
