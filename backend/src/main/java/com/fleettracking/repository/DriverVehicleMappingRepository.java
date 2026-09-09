package com.fleettracking.repository;

import com.fleettracking.entity.DriverVehicleMapping;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverVehicleMappingRepository extends JpaRepository<DriverVehicleMapping, Long> {
    Optional<DriverVehicleMapping> findByDriverIdAndIsActiveTrue(Long driverId);
    Optional<DriverVehicleMapping> findByVehicleIdAndIsActiveTrue(Long vehicleId);
}
