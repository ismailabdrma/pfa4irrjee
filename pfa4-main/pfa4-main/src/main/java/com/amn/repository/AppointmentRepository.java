package com.amn.repository;

import com.amn.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByMedicalFolderId(Long medicalDocumentId);
}
