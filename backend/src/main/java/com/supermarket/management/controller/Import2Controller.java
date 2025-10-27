package com.supermarket.management.controller;

import com.supermarket.management.dto.Import2DTO;
import com.supermarket.management.entity.Import2;
import com.supermarket.management.entity.ImportDetail2;
import com.supermarket.management.service.Import2Service;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/imports2")
@CrossOrigin(origins = "*")
public class Import2Controller {

    private final Import2Service import2Service;

    public Import2Controller(Import2Service import2Service) {
        this.import2Service = import2Service;
    }

    // GET /api/imports
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllImports(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "none") String sort,
            @RequestParam(defaultValue = "importDate") String sortBy) {

        Page<Import2> importPage = import2Service.getAllImports(page - 1, size, sort, sortBy);

        Map<String, Object> response = new HashMap<>();
        response.put("data", importPage.getContent().stream().map(import2Service::toDTO).toList());
        response.put("currentPage", importPage.getNumber() + 1);
        response.put("totalItems", importPage.getTotalElements());
        response.put("totalPages", importPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    // POST /api/imports
    @PostMapping
    public ResponseEntity<?> createImport(@RequestBody Import2DTO dto) {
        try {
            Import2 saved = import2Service.saveImport(dto);
            return ResponseEntity.ok(saved); // trả về import đã lưu
        } catch (IllegalArgumentException ex) {
            // Trả về lỗi client khi dữ liệu không hợp lệ
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{importId}")
    public void updateImport(@PathVariable Integer importId, @RequestBody Import2DTO dto) {
        import2Service.updateImport(importId, dto);
    }

    // DELETE /api/imports/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImport(@PathVariable Integer id) {
        import2Service.deleteImport(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchImports(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sort,
            @RequestParam(defaultValue = "importDate") String sortBy
    ) {
        var importPage = import2Service.searchByDateRange(startDate, endDate, page - 1, size, sort, sortBy);

        Map<String, Object> response = new HashMap<>();
        response.put("data", importPage.getContent().stream().map(import2Service::toDTO).toList());
        response.put("currentPage", importPage.getNumber() + 1);
        response.put("totalItems", importPage.getTotalElements());
        response.put("totalPages", importPage.getTotalPages());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Import2DTO> getImportById(@PathVariable Integer id) {
        Import2DTO dto = import2Service.getImportById(id)
                .orElseThrow(() -> new RuntimeException("Phiếu nhập không tồn tại"));
        return ResponseEntity.ok(dto);
    }

}
