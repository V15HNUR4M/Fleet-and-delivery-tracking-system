package com.fleettracking.repository;

import com.fleettracking.entity.Driver;
import com.fleettracking.enums.DriverAvailability;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByMobile(String mobile);
    Page<Driver> findByAvailability(DriverAvailability availability, Pageable pageable);
    Optional<Driver> findFirstByAvailability(DriverAvailability availability);
}
