import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DoctorService } from 'src/app/services/doctor.service';
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-doctor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {

  // Doctor profile
  doctorName = '';
  doctorEmail = '';

  // Patient search
  cin = '';
  fullName = '';
  patientProfile: any = null;
  patientId: number | null = null;
  folderId: number | null = null;

  // UI states
  showEditProfileForm = false;
  activeDocTab: string = 'scans';
  isLoading = false;
  uploadProgress: number | null = null;

  // Medical data forms
  manualData = {
    bloodType: '',
    emergencyContact: '',
    allergies: '',
    chronicDiseases: '',
    hasHeartProblem: false,
    hasSurgery: false,
    birthDate: ''
  };

  vaccination = {
    vaccineName: '',
    doseNumber: 1,
    manufacturer: '',
    date: ''
  };

  consultation = {
    reason: '',
    notes: '',
    diagnosis: ''
  };

  medications: any[] = [];

  // File uploads
  scanPayload = { title: '', description: '' };
  analysisPayload = { title: '', description: '' };
  surgeryPayload = { title: '', description: '' };

  scanFile: File | null = null;
  analysisFile: File | null = null;
  surgeryFile: File | null = null;
  activeUploadTab: string = 'scans'

  constructor(private doctorService: DoctorService, private router: Router,private authService: AuthService,  // Add this
              private location: Location) {}

  ngOnInit(): void {
    // First check authentication
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    // Then verify role
    const user = this.authService.getCurrentUser();
    if (user?.role !== 'DOCTOR') {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    // Only then load profile
    this.loadDoctorProfile();
  }

  // ========== PROFILE METHODS ==========
  loadDoctorProfile(): void {
    this.isLoading = true;
    this.doctorService.getCurrentDoctorProfile().subscribe({
      next: (doctor) => {
        this.doctorName = doctor.fullName || 'Docteur';
        this.doctorEmail = doctor.email || '';
        this.isLoading = false;
      },
      error: () => {
        console.error('Erreur lors du chargement du profil du médecin.');
        this.isLoading = false;
      }
    });
  }

  // ========== PATIENT METHODS ==========
  searchPatient(): void {
    if (!this.cin && !this.fullName) {
      alert('Veuillez entrer au moins un critère de recherche');
      return;
    }

    this.isLoading = true;
    this.doctorService.getFullPatientProfile(this.cin, this.fullName).subscribe({
      next: (profile) => {
        this.patientProfile = profile;
        this.patientId = profile.id;
        this.folderId = profile.medicalFolderId;
        this.initializePatientData(profile);
        this.isLoading = false;
      },
      error: () => {
        alert('Patient introuvable.');
        this.isLoading = false;
      }
    });
  }

  private initializePatientData(profile: any): void {
    this.manualData = {
      bloodType: profile.bloodType || '',
      emergencyContact: profile.emergencyContact || '',
      allergies: profile.allergies || '',
      chronicDiseases: profile.chronicDiseases || '',
      hasHeartProblem: profile.hasHeartProblem || false,
      hasSurgery: profile.hasSurgery || false,
      birthDate: profile.birthDate || ''
    };
  }

  editPatientProfile(): void {
    this.showEditProfileForm = true;
  }

  submitManualFolder(): void {
    if (!this.validateManualFolder()) return;

    this.isLoading = true;
    this.doctorService.createOrUpdateMedicalFolder(this.cin, this.fullName, this.manualData)
      .subscribe({
        next: () => {
          alert('Dossier médical mis à jour avec succès.');
          this.showEditProfileForm = false;
          this.searchPatient();
          this.isLoading = false;
        },
        error: () => {
          console.error('Erreur lors de la mise à jour du dossier médical.');
          this.isLoading = false;
        }
      });
  }

  private validateManualFolder(): boolean {
    if (!this.cin || !this.fullName || !this.folderId) {
      alert('Informations patient manquantes');
      return false;
    }
    return true;
  }

  // ========== FILE UPLOAD METHODS ==========
  onScanFileChange(event: Event): void {
    this.handleFileChange(event, 'scan');
  }

  onAnalysisFileChange(event: Event): void {
    this.handleFileChange(event, 'analysis');
  }

  onSurgeryFileChange(event: Event): void {
    this.handleFileChange(event, 'surgery');
  }

  private handleFileChange(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Le fichier ne doit pas dépasser 10MB');
        input.value = '';
        return;
      }

      switch(type) {
        case 'scan': this.scanFile = file; break;
        case 'analysis': this.analysisFile = file; break;
        case 'surgery': this.surgeryFile = file; break;
      }
    }
  }

  uploadScan(): void {
    if (!this.validateUpload('scan')) return;
    this.executeUpload('scan');
  }

  uploadAnalysis(): void {
    if (!this.validateUpload('analysis')) return;
    this.executeUpload('analysis');
  }

  uploadSurgery(): void {
    if (!this.validateUpload('surgery')) return;
    this.executeUpload('surgery');
  }

  private validateUpload(type: string): boolean {
    if (!this.folderId) {
      alert('Aucun dossier patient sélectionné');
      return false;
    }

    let file, payload;
    switch(type) {
      case 'scan':
        file = this.scanFile;
        payload = this.scanPayload;
        break;
      case 'analysis':
        file = this.analysisFile;
        payload = this.analysisPayload;
        break;
      case 'surgery':
        file = this.surgeryFile;
        payload = this.surgeryPayload;
        break;
    }

    if (!file) {
      alert('Veuillez sélectionner un fichier');
      return false;
    }

    if (!payload?.title.trim()) {
      alert('Le titre est obligatoire');
      return false;
    }

    return true;
  }

  private executeUpload(type: string): void {
    this.isLoading = true;
    this.uploadProgress = 0;

    const formData = new FormData();
    let serviceCall;

    switch(type) {
      case 'scan':
        formData.append('file', this.scanFile!);
        formData.append('title', this.scanPayload.title);
        formData.append('description', this.scanPayload.description);
        serviceCall = this.doctorService.uploadScan(formData, this.folderId!);
        break;
      case 'analysis':
        formData.append('file', this.analysisFile!);
        formData.append('title', this.analysisPayload.title);
        formData.append('description', this.analysisPayload.description);
        serviceCall = this.doctorService.uploadAnalysis(formData, this.folderId!);
        break;
      case 'surgery':
        formData.append('file', this.surgeryFile!);
        formData.append('title', this.surgeryPayload.title);
        formData.append('description', this.surgeryPayload.description);
        serviceCall = this.doctorService.uploadSurgery(formData, this.folderId!);
        break;
    }

    serviceCall!.subscribe({
      next: () => {
        this.handleUploadSuccess(type);
      },
      error: (err) => {
        this.handleUploadError(type, err);
      }
    });
  }

  private handleUploadSuccess(type: string): void {
    let message = '';
    switch(type) {
      case 'scan':
        message = 'Scan ajouté avec succès';
        this.resetScanForm();
        break;
      case 'analysis':
        message = 'Analyse ajoutée avec succès';
        this.resetAnalysisForm();
        break;
      case 'surgery':
        message = 'Chirurgie ajoutée avec succès';
        this.resetSurgeryForm();
        break;
    }

    alert(message);
    this.searchPatient();
    this.setActiveDocTab(type + 's'); // 'scans', 'analyses', 'surgeries'
    this.isLoading = false;
    this.uploadProgress = null;
  }

  private handleUploadError(type: string, err: any): void {
    console.error(`Erreur lors de l'ajout du ${type}:`, err);
    alert(`Erreur lors de l'ajout du ${type}. Veuillez réessayer.`);
    this.isLoading = false;
    this.uploadProgress = null;
  }

  resetScanForm(): void {
    this.scanPayload = { title: '', description: '' };
    this.scanFile = null;
    this.resetFileInput('scanFileInput');
  }

  resetAnalysisForm(): void {
    this.analysisPayload = { title: '', description: '' };
    this.analysisFile = null;
    this.resetFileInput('analysisFileInput');
  }

  resetSurgeryForm(): void {
    this.surgeryPayload = { title: '', description: '' };
    this.surgeryFile = null;
    this.resetFileInput('surgeryFileInput');
  }

  private resetFileInput(id: string): void {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  // ========== VACCINATION METHODS ==========
  addVaccination(): void {
    if (!this.validateVaccination()) return;

    this.isLoading = true;
    this.doctorService.addVaccination(
      this.folderId!,
      this.vaccination.vaccineName,
      this.vaccination.doseNumber,
      this.vaccination.manufacturer,
      this.vaccination.date
    ).subscribe({
      next: () => {
        this.handleVaccinationSuccess();
      },
      error: (err) => {
        this.handleVaccinationError(err);
      }
    });
  }

  private validateVaccination(): boolean {
    if (!this.folderId) {
      alert("Veuillez d'abord sélectionner un patient.");
      return false;
    }

    if (!this.vaccination.vaccineName.trim()) {
      alert("Le nom du vaccin est obligatoire.");
      return false;
    }

    if (!this.vaccination.manufacturer.trim()) {
      alert("Le fabricant est obligatoire.");
      return false;
    }

    if (!this.vaccination.date) {
      alert("La date de vaccination est obligatoire.");
      return false;
    }

    return true;
  }

  private handleVaccinationSuccess(): void {
    alert('Vaccination ajoutée avec succès.');
    this.vaccination = {
      vaccineName: '',
      doseNumber: 1,
      manufacturer: '',
      date: ''
    };
    this.searchPatient();
    this.setActiveDocTab('vaccinations');
    this.isLoading = false;
  }

  private handleVaccinationError(err: any): void {
    console.error('Erreur lors de l\'ajout de la vaccination:', err);
    alert('Erreur lors de l\'ajout de la vaccination. Veuillez vérifier les données et réessayer.');
    this.isLoading = false;
  }

  // ========== CONSULTATION & PRESCRIPTION METHODS ==========
  createConsultation(): void {
    if (!this.validateConsultation()) return;

    this.isLoading = true;
    const consultationData = {
      reason: this.consultation.reason,
      notes: this.consultation.notes,
      diagnosis: this.consultation.diagnosis
    };

    this.doctorService.createMedicalRecord(this.patientId!, consultationData)
      .subscribe({
        next: () => {
          this.handleConsultationSuccess();
        },
        error: (err) => {
          this.handleConsultationError(err);
        }
      });
  }

  private validateConsultation(): boolean {
    if (!this.patientId) {
      alert('Aucun patient sélectionné');
      return false;
    }

    if (!this.consultation.reason.trim()) {
      alert("Le motif de consultation est obligatoire.");
      return false;
    }

    return true;
  }

  private handleConsultationSuccess(): void {
    alert('Consultation créée avec succès.');
    this.searchPatient();
    this.isLoading = false;
  }

  private handleConsultationError(err: any): void {
    console.error('Erreur lors de la création de la consultation:', err);
    alert('Erreur lors de la création de la consultation. Veuillez réessayer.');
    this.isLoading = false;
  }

  addMedication(): void {
    this.medications.push({
      name: '',
      dosage: '',
      period: '',
      permanent: false
    });
  }

  removeMedication(index: number): void {
    this.medications.splice(index, 1);
  }

  submitPrescription(): void {
    if (!this.validatePrescription()) return;

    this.isLoading = true;
    const latestRecordId = this.patientProfile.medicalRecords[this.patientProfile.medicalRecords.length - 1].id;
    const prescriptionData = {
      medications: this.medications,
      notes: this.consultation.notes
    };

    this.doctorService.submitPrescriptionWithMedications(
      this.patientId!,
      latestRecordId,
      prescriptionData
    ).subscribe({
      next: () => {
        this.handlePrescriptionSuccess();
      },
      error: (err) => {
        this.handlePrescriptionError(err);
      }
    });
  }

  private validatePrescription(): boolean {
    if (!this.patientId || !this.patientProfile?.medicalRecords?.length) {
      alert("Veuillez créer une consultation avant d'ajouter une ordonnance.");
      return false;
    }

    if (this.medications.length === 0) {
      alert("Veuillez ajouter au moins un médicament à l'ordonnance.");
      return false;
    }

    const invalidMeds = this.medications.some(med =>
      !med.name.trim() || !med.dosage.trim() || !med.period.trim()
    );

    if (invalidMeds) {
      alert("Veuillez remplir tous les champs pour chaque médicament.");
      return false;
    }

    return true;
  }

  private handlePrescriptionSuccess(): void {
    alert('Ordonnance créée avec succès.');
    this.medications = [];
    this.consultation = {
      reason: '',
      notes: '',
      diagnosis: ''
    };
    this.searchPatient();
    this.isLoading = false;
  }

  private handlePrescriptionError(err: any): void {
    console.error('Erreur lors de la création de l\'ordonnance:', err);
    alert('Erreur lors de la création de l\'ordonnance. Veuillez réessayer.');
    this.isLoading = false;
  }

  // ========== UI HELPER METHODS ==========
  setActiveDocTab(tabId: string): void {
    this.activeDocTab = tabId;
    // Implement tab switching logic as needed
  }

  navigateToConsultation(): void {
    if (!this.patientProfile) {
      alert("Veuillez d'abord sélectionner un patient.");
      return;
    }
    this.router.navigateByUrl(`/dashboard/doctor/consultation-prescription/${this.cin}/${this.fullName}`);
  }

  viewConsultationDetails(recordId: number): void {
    this.router.navigate(['/dashboard/doctor/consultation', recordId]);
  }

  viewPrescriptionDetails(prescriptionId: number): void {
    this.router.navigate(['/dashboard/doctor/prescription', prescriptionId]);
  }

  openFile(fileUrl: string): void {
    if (fileUrl) {
      const fullUrl = 'http://localhost:8080' + fileUrl;
      window.open(fullUrl, '_blank');
    } else {
      alert('Lien du fichier invalide ou manquant.');
    }
  }

}
