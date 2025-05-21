package com.amn.repository;

import com.amn.entity.Scan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScanRepository extends JpaRepository<Scan, Long> {
    List<Scan> findByMedicalFolder_Id(Long medicalFolderId);
    List<Scan> findByMedicalFolderId(Long folderId);

    List<Scan> findAllByMedicalFolderId(Long id);
}
