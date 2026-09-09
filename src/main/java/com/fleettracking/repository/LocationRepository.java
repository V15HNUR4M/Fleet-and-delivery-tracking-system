package com.fleettracking.repository;

import com.fleettracking.entity.Location;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByDriverIdAndRecordedAtBetween(Long driverId, LocalDateTime from, LocalDateTime to);
}
