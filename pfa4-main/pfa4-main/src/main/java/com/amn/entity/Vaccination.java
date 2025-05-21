package com.amn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vaccineName;
    private int doseNumber;
    private String manufacturer;
    private LocalDate vaccinationDate;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_folder_id")
    @JsonIgnore
    @BatchSize(size = 10)
    private MedicalFolder medicalFolder;
}
