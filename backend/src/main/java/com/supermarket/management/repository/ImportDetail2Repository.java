package com.supermarket.management.repository;

import com.supermarket.management.entity.ImportDetail2;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportDetail2Repository extends JpaRepository<ImportDetail2, Integer> {
    List<ImportDetail2> findByImport2ImportId(Integer importId);
}

