package com.example.demo.service;

import com.example.demo.entity.ImportEntity;
import com.example.demo.repository.ImportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImportService {

    private final ImportRepository importRepository;

    public ImportService(ImportRepository importRepository) {
        this.importRepository = importRepository;
    }

    public List<ImportEntity> getAllImports() {
        return importRepository.findAll();
    }

    public Optional<ImportEntity> getImportById(Integer id) {
        return importRepository.findById(id);
    }

    public ImportEntity createImport(ImportEntity importEntity) {
        return importRepository.save(importEntity);
    }

    public ImportEntity updateImport(Integer id, ImportEntity updated) {
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
