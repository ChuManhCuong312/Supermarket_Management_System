package com.supermarket.management.repository;

import com.supermarket.management.entity.Import2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface Import2Repository extends JpaRepository<Import2, Integer> {
    Page<Import2> findByImportDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
}

