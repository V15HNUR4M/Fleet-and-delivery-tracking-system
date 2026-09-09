package com.fleettracking.exception;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex) {
        return buildErrorResponse(ex, HttpStatus.NOT_FOUND, "https://example.com/problems/not-found");
    }

    @ExceptionHandler(InvalidStateTransitionException.class)
    public ResponseEntity<ApiError> handleConflict(InvalidStateTransitionException ex) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT, "https://example.com/problems/invalid-state-transition");
    }

    @ExceptionHandler(DriverNotAvailableException.class)
    public ResponseEntity<ApiError> handleDriverNotAvailable(DriverNotAvailableException ex) {
        return buildErrorResponse(ex, HttpStatus.CONFLICT, "https://example.com/problems/driver-not-available");
    }

    @ExceptionHandler(CapacityExceededException.class)
    public ResponseEntity<ApiError> handleCapacityExceeded(CapacityExceededException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, "https://example.com/problems/capacity-exceeded");
    }

    @ExceptionHandler(MaxRetryExceededException.class)
    public ResponseEntity<ApiError> handleMaxRetryExceeded(MaxRetryExceededException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, "https://example.com/problems/max-retry-exceeded");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleBadRequest(IllegalArgumentException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, "https://example.com/problems/bad-request");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return buildErrorResponse(new IllegalArgumentException(
                "A record with the same unique value already exists (for example, mobile number or licence number)."),
                HttpStatus.CONFLICT,
                "https://example.com/problems/duplicate-resource");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex) {
        return buildErrorResponse(ex, HttpStatus.BAD_REQUEST, "https://example.com/problems/validation-error");
    }

    private ResponseEntity<ApiError> buildErrorResponse(Exception ex, HttpStatus status, String type) {
        ApiError error = ApiError.builder()
                .type(type)
                .title(status.getReasonPhrase())
                .status(status.value())
                .detail(ex.getMessage())
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(error);
    }
}
