package com.supermarket.management.service;

import com.supermarket.management.dto.Import2DTO;
import com.supermarket.management.dto.ImportDetail2DTO;
import com.supermarket.management.entity.Import2;
import com.supermarket.management.entity.ImportDetail2;
import com.supermarket.management.entity.Product;
import com.supermarket.management.repository.Import2Repository;
import com.supermarket.management.repository.ImportDetail2Repository;
import com.supermarket.management.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class Import2Service {

    private final Import2Repository import2Repository;
    private final ImportDetail2Repository importDetail2Repository;
    private final ProductRepository productRepository;

    public Import2Service(Import2Repository import2Repository,
                          ImportDetail2Repository importDetail2Repository,ProductRepository productRepository) {
        this.import2Repository = import2Repository;
        this.importDetail2Repository = importDetail2Repository;
        this.productRepository = productRepository;
    }

    // Lấy tất cả import với phân trang và sort
    public Page<Import2> getAllImports(int page, int size, String sort, String sortBy) {
        Pageable pageable;
        if ("desc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        } else if ("asc".equalsIgnoreCase(sort)) {
            pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortBy));
        } else {
            pageable = PageRequest.of(page, size);
        }
        return import2Repository.findAll(pageable);
    }


    // Tạo import mới
    public Import2 saveImport(Import2DTO dto) {
        validateImport(dto); // kiểm tra dữ liệu trước khi save

        Import2 import2 = new Import2();
        import2.setImportId(dto.getImportId());
        import2.setImportDate(dto.getImportDate());
        import2.setTotalAmount(BigDecimal.valueOf(dto.getTotalAmount()));
        import2.setNote(dto.getNote());

        if (dto.getImportDetails() != null) {
            import2.setImportDetails(
                    dto.getImportDetails().stream().map(d -> {
                        ImportDetail2 detail = new ImportDetail2();
                        detail.setDetailId(d.getDetailId() != null && d.getDetailId() == 0 ? null : d.getDetailId());
                        detail.setImport2(import2);

                        Product product = productRepository.findById(d.getProductId())
                                .orElseThrow(() -> new IllegalArgumentException("Product không tồn tại id=" + d.getProductId()));
                        detail.setProduct(product);

                        detail.setQuantity(d.getQuantity());
                        detail.setUnitPrice(BigDecimal.valueOf(d.getUnitPrice()));
                        detail.setSubtotal(BigDecimal.valueOf(d.getSubtotal()));
                        return detail;
                    }).collect(Collectors.toList())
            );
        }

        return import2Repository.save(import2);
    }

    // Cập nhật import
    public void updateImport(Integer importId, Import2DTO dto) {
        validateImport(dto);
        Import2 import2 = import2Repository.findById(importId)
                .orElseThrow(() -> new RuntimeException("Import không tồn tại id=" + importId));

        import2.setImportDate(dto.getImportDate());
        import2.setTotalAmount(BigDecimal.valueOf(dto.getTotalAmount()));
        import2.setNote(dto.getNote());

        // Lấy chi tiết cũ từ DB
        List<ImportDetail2> existingDetails = import2.getImportDetails();

        // Xóa chi tiết không còn trong DTO
        existingDetails.removeIf(detail -> dto.getImportDetails().stream()
                .noneMatch(d -> d.getDetailId() != null && d.getDetailId().equals(detail.getDetailId())));

        // Thêm hoặc cập nhật chi tiết
        for (ImportDetail2DTO d : dto.getImportDetails()) {
            if (d.getDetailId() == null || d.getDetailId() == 0) {
                // Thêm chi tiết mới
                ImportDetail2 newDetail = new ImportDetail2();
                newDetail.setImport2(import2);

                Product product = productRepository.findById(d.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product không tồn tại id=" + d.getProductId()));
                newDetail.setProduct(product);

                newDetail.setQuantity(d.getQuantity());
                newDetail.setUnitPrice(BigDecimal.valueOf(d.getUnitPrice()));
                newDetail.setSubtotal(BigDecimal.valueOf(d.getSubtotal()));

                existingDetails.add(newDetail);
            } else {
                // Cập nhật chi tiết cũ
                ImportDetail2 existingDetail = existingDetails.stream()
                        .filter(ed -> ed.getDetailId().equals(d.getDetailId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Chi tiết không tồn tại id=" + d.getDetailId()));

                existingDetail.setQuantity(d.getQuantity());
                existingDetail.setUnitPrice(BigDecimal.valueOf(d.getUnitPrice()));
                existingDetail.setSubtotal(BigDecimal.valueOf(d.getSubtotal()));

                Product product = productRepository.findById(d.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product không tồn tại id=" + d.getProductId()));
                existingDetail.setProduct(product);
            }
        }

        import2Repository.save(import2); // Lưu lại toàn bộ
    }


    // Xóa import
    public void deleteImport(Integer id) {
        import2Repository.deleteById(id);
    }

    // Lấy chi tiết import
    public List<ImportDetail2> getImportDetails(Integer importId) {
        return importDetail2Repository.findByImport2ImportId(importId);
    }
    public Import2DTO toDTO(Import2 import2) {
        Import2DTO dto = new Import2DTO();
        dto.setImportId(import2.getImportId());
        dto.setImportDate(import2.getImportDate());
        dto.setTotalAmount(import2.getTotalAmount().doubleValue());
        dto.setNote(import2.getNote());
        dto.setImportDetails(
                import2.getImportDetails().stream().map(detail -> {
                    ImportDetail2DTO d = new ImportDetail2DTO();
                    d.setDetailId(detail.getDetailId());
                    d.setProductId(detail.getProduct().getProductId());
                    d.setProductName(detail.getProduct().getName());
                    d.setQuantity(detail.getQuantity());
                    d.setUnitPrice(detail.getUnitPrice().doubleValue());
                    d.setSubtotal(detail.getSubtotal().doubleValue());
                    return d;
                }).toList()
        );
        return dto;
    }
    public Page<Import2> searchByDateRange(LocalDate startDate, LocalDate endDate,
                                           int page, int size, String sortDir, String sortBy) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        return import2Repository.findByImportDateBetween(startDate, endDate, pageable);
    }

    public Optional<Import2DTO> getImportById(Integer id) {
        return import2Repository.findById(id).map(this::toDTO);
    }
    // Trong ImportService
    private void validateImport(Import2DTO dto) {
        if (dto.getImportDate() == null) {
            throw new IllegalArgumentException("Ngày nhập không được để trống");
        }

        if (dto.getImportDetails() == null || dto.getImportDetails().isEmpty()) {
            throw new IllegalArgumentException("Phải có ít nhất 1 chi tiết nhập kho");
        }

        for (ImportDetail2DTO d : dto.getImportDetails()) {
            // Kiểm tra Product ID
            if (d.getProductId() == null || d.getProductId() == 0) {
                throw new IllegalArgumentException("Phải có ít nhất 1 sản phẩm tồn tại");
            }

            // Kiểm tra Product Name
            if (d.getProductName() == null || d.getProductName().trim().isEmpty()) {
                throw new IllegalArgumentException("Tên sản phẩm không được để trống");
            }

            // Kiểm tra Quantity
            if (d.getQuantity() <= 0) {
                throw new IllegalArgumentException("Số lượng phải lớn hơn 0 ");
            }

            // Kiểm tra Unit Price
            if (d.getUnitPrice() <= 0) {
                throw new IllegalArgumentException("Đơn giá phải lớn hơn 0 ");
            }

        }
    }

}

