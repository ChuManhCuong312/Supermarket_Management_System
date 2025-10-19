package com.supermarket.management.repository;

import com.supermarket.management.entity.Import;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ImportRepository extends JpaRepository<Import, Integer> {

    @Query("SELECT i FROM Import i WHERE i.importDate BETWEEN :start AND :end ORDER BY i.importDate ASC")
    List<Import> findByDateAsc(LocalDate start, LocalDate end);

    @Query("SELECT i FROM Import i WHERE i.importDate BETWEEN :start AND :end ORDER BY i.importDate DESC")
    List<Import> findByDateDesc(LocalDate start, LocalDate end);

    @Query("SELECT i FROM Import i WHERE i.totalAmount BETWEEN :min AND :max ORDER BY i.totalAmount ASC")
    List<Import> findByAmountAsc(BigDecimal min, BigDecimal max);

    @Query("SELECT i FROM Import i WHERE i.totalAmount BETWEEN :min AND :max ORDER BY i.totalAmount DESC")
    List<Import> findByAmountDesc(BigDecimal min, BigDecimal max);
}
