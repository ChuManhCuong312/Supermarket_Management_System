package com.supermarket.management.service;

import com.supermarket.management.entity.Import;
import com.supermarket.management.repository.ImportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImportService {

    private final ImportRepository importRepository;

    public ImportService(ImportRepository importRepository) {
        this.importRepository = importRepository;
    }

    public List<Import> getAllImports() {
        return importRepository.findAll();
    }

    public Optional<Import> getImportById(Integer id) {
        return importRepository.findById(id);
    }

    public Import createImport(Import importEntity) {
        return importRepository.save(importEntity);
    }

    public Import updateImport(Integer id, Import updated) {
        return importRepository.findById(id)
                .map(existing -> {
                    existing.setSupplierId(updated.getSupplierId());
                    existing.setImportDate(updated.getImportDate());
                    existing.setTotalAmount(updated.getTotalAmount());
                    existing.setStatus(updated.getStatus());
                    existing.setNote(updated.getNote());
                    return importRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Import not found with id " + id));
    }

    public void deleteImport(Integer id) {
        importRepository.deleteById(id);
    }
}
