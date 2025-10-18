package com.supermarket.management.controller;

import com.supermarket.management.entity.ImportEntity;
import com.supermarket.management.service.ImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imports")
@CrossOrigin(origins = "*")
public class ImportController {

    private final ImportRepository importRepository;

    public ImportController(ImportRepository importRepository) {
        this.importRepository = importRepository;
    }

    // ------------------ GET ALL ------------------
    @GetMapping
    public ResponseEntity<?> getAllImports() {
        try {
            List<ImportEntity> list = importRepository.findAll();
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch imports", e.getMessage());
        }
    }

    // ------------------ GET BY ID ------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getImportById(@PathVariable Integer id) {
        try {
            return importRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> buildError(HttpStatus.NOT_FOUND, "Import not found with id: " + id, null));
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get import", e.getMessage());
        }
    }

    // ------------------ CREATE ------------------
    @PostMapping
    public ResponseEntity<?> createImport(@RequestBody ImportEntity importEntity) {
        try {
            if (importEntity.getImportDate() == null) {
                return buildError(HttpStatus.BAD_REQUEST, "Import date cannot be null", null);
            }
            ImportEntity saved = importRepository.save(importEntity);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create import", e.getMessage());
        }
    }

    // ------------------ UPDATE ------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updateImport(@PathVariable Integer id, @RequestBody ImportEntity updated) {
        try {
            return importRepository.findById(id)
                    .map(existing -> {
                        existing.setSupplierId(updated.getSupplierId());
                        existing.setImportDate(updated.getImportDate());
                        existing.setTotalAmount(updated.getTotalAmount());
                        existing.setStatus(updated.getStatus());
                        existing.setNote(updated.getNote());
                        ImportEntity saved = importRepository.save(existing);
                        return ResponseEntity.ok(saved);
                    })
                    .orElseGet(() -> buildError(HttpStatus.NOT_FOUND, "Import not found with id: " + id, null));
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update import", e.getMessage());
        }
    }

    // ------------------ DELETE ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImport(@PathVariable Integer id) {
        try {
            if (!importRepository.existsById(id)) {
                return buildError(HttpStatus.NOT_FOUND, "Import not found with id: " + id, null);
            }
            importRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Import deleted successfully");
            response.put("status", HttpStatus.NO_CONTENT.value());
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete import", e.getMessage());
        }
    }

    // ------------------ PRIVATE ERROR BUILDER ------------------
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