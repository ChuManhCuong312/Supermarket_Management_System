package com.example.demo.repository;

import com.example.demo.entity.Import;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImportRepository extends JpaRepository<ImportEntity, Integer> {
}
