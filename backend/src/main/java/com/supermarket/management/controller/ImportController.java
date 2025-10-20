package com.supermarket.management.controller;

import com.supermarket.management.entity.Import;
import com.supermarket.management.repository.ImportRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

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

    // ALL
    @GetMapping
    public ResponseEntity<?> getAllImports() {
        try {
            List<Import> list = importRepository.findAll();
            return ResponseEntity.ok(list);
        }
        // System exception
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch imports", e.getMessage());
        }
    }

    // ------------------ LẤY IMPORT THEO ID ------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getImportById(@PathVariable Integer id) {
        try {
            // Tìm import theo id
            return importRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(null));
        }
        // System exception
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get import", e.getMessage());
        }
    }

    // ------------------ TẠO MỚI IMPORT ------------------
    @PostMapping
    public ResponseEntity<?> createImport(@Valid @RequestBody Import importEntity) {
        try {
            // Dữ liệu hợp lệ → lưu import
            Import saved = importRepository.save(importEntity);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }
        // Exception: lỗi hệ thống (ví dụ lỗi DB, null pointer,...)
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create import", e.getMessage());
        }
    }

    // ------------------ CẬP NHẬT IMPORT ------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updateImport(@PathVariable Integer id, @Valid @RequestBody Import updated) {
        try {
            return importRepository.findById(id)
                    .map(existing -> {
                        // Cập nhật thông tin import
                        existing.setSupplierId(updated.getSupplierId());
                        existing.setImportDate(updated.getImportDate());
                        existing.setTotalAmount(updated.getTotalAmount());
                        existing.setStatus(updated.getStatus());
                        existing.setNote(updated.getNote());
                        Import saved = importRepository.save(existing);
                        return ResponseEntity.ok(saved);
                    })
                    // Nếu không tồn tại import theo id → 404
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(null));
        }
        // Exception: các lỗi hệ thống hoặc validation không mong muốn
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update import", e.getMessage());
        }
    }

    // ------------------ XÓA IMPORT ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteImport(@PathVariable Integer id) {
        try {
            // Nếu không tìm thấy → trả lỗi 404
            if (!importRepository.existsById(id)) {
                return buildError(HttpStatus.NOT_FOUND, "Import not found with id: " + id, null);
            }
            importRepository.deleteById(id);

            // Trả thông báo xóa thành công
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Import deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
        }
        // Exception: lỗi hệ thống khi xóa (ràng buộc khóa ngoại, DB lỗi,...)
        catch (Exception e) {
            return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete import", e.getMessage());
        }
    }

    // ------------------ XỬ LÝ LỖI VALIDATION ------------------
    // Khi request body không hợp lệ (ví dụ thiếu importDate, giá trị âm,...)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        // Lấy message từ annotation @NotNull, @DecimalMin,...
        String message = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        // Trả lỗi 400 (Bad Request)
        return buildError(HttpStatus.BAD_REQUEST, "Validation failed", message);
    }

    // ------------------ LỌC THEO NGÀY ------------------
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

    // ------------------ LỌC THEO TỔNG TIỀN ------------------
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

    // ------------------ HÀM DÙNG CHUNG: TẠO JSON LỖI ------------------
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
