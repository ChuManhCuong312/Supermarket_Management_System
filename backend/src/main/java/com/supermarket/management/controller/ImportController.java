package com.supermarket.management.controller;

import com.supermarket.management.entity.Import;
import com.supermarket.management.repository.ImportRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/imports")
@CrossOrigin(origins = "*")
public class ImportController {

    private final ImportRepository importRepository;
    public ImportController(ImportRepository importRepository) {
        this.importRepository = importRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllImports(
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Import> importPage = importRepository.findAll(pageable);
            Map<String, Object> response = new HashMap<>();
            response.put("imports", importPage.getContent());
            response.put("currentPage", importPage.getNumber());
            response.put("totalItems", importPage.getTotalElements());
            response.put("totalPages", importPage.getTotalPages());
            return ResponseEntity.ok(response);
        }

        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch imports", e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getImportById(@PathVariable Integer id) {
        try {
            return importRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(null));
        }
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get import", e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createImport(@Valid @RequestBody Import importEntity) {
        try {
            Import saved = importRepository.save(importEntity);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create import", e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateImport(@PathVariable Integer id, @Valid @RequestBody Import updated) {
        try {
            return importRepository.findById(id)
                    .map(existing -> {
                        existing.setSupplierId(updated.getSupplierId());
                        existing.setImportDate(updated.getImportDate());
                        existing.setTotalAmount(updated.getTotalAmount());
                        existing.setStatus(updated.getStatus());
                        existing.setNote(updated.getNote());
                        Import saved = importRepository.save(existing);
                        return ResponseEntity.ok(saved);
                    })
                    //Không tìm thấy theo ID -> 404
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(null));
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update import", e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImport(@PathVariable Integer id) {
        try {
            if (!importRepository.existsById(id)) {
                return buildError(HttpStatus.NOT_FOUND, "Import not found with id: " + id, null);
            }
            importRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Import deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        }
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete import", e.getMessage());
        }
    }

    // LỖI VALIDATION
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return buildError(HttpStatus.BAD_REQUEST, "Validation failed", message);
    }

    @GetMapping("/filter/date")
    public ResponseEntity<?> filterByDate(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "asc") String sortOrder) {

        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            if (end.isBefore(start)) {
                return buildError(HttpStatus.BAD_REQUEST, "End date must be after start date", null);
            }

            List<Import> imports = sortOrder.equalsIgnoreCase("desc")
                    ? importRepository.findByDateDesc(start, end)
                    : importRepository.findByDateAsc(start, end);

            return imports.isEmpty()
                    ? buildError(HttpStatus.NOT_FOUND, "No imports found in the given date range", null)
                    : ResponseEntity.ok(imports);

        } catch (Exception e) {
            return buildError(HttpStatus.BAD_REQUEST, "Invalid date format", e.getMessage());
        }
    }

    @GetMapping("/filter/amount")
    public ResponseEntity<?> filterByAmount(
            @RequestParam BigDecimal minAmount,
            @RequestParam BigDecimal maxAmount,
            @RequestParam(defaultValue = "asc") String sortOrder) {

        try {
            if (maxAmount.compareTo(minAmount) < 0) {
                return buildError(HttpStatus.BAD_REQUEST, "Max amount must be greater than or equal to min amount",
                        null);
            }

            List<Import> imports = sortOrder.equalsIgnoreCase("desc")
                    ? importRepository.findByAmountDesc(minAmount, maxAmount)
                    : importRepository.findByAmountAsc(minAmount, maxAmount);

            return imports.isEmpty()
                    ? buildError(HttpStatus.NOT_FOUND, "No imports found in the given amount range", null)
                    : ResponseEntity.ok(imports);

        } catch (Exception e) {
            return buildError(HttpStatus.BAD_REQUEST, "Invalid amount input", e.getMessage());
        }
    }

    private ResponseEntity<Map<String, Object>> buildError(HttpStatus status, String message, String details) {
        Map<String, Object> error = new HashMap<>();
        error.put("timestamp", new Date());
        error.put("status", status.value());
        error.put("error", status.getReasonPhrase());
        error.put("message", message);
        if (details != null)
            error.put("details", details);
        return new ResponseEntity<>(error, status);
    }
}
