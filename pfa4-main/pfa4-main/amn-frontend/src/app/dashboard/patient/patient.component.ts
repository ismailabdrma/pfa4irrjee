import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/PatientService';
import { PatientBasicInfoDTO, PatientProfileDTO } from '../../services/PatientService';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PatientComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  patientBasicInfo: PatientBasicInfoDTO | null = null;
  patientProfile: PatientProfileDTO | null = null;
  isEditMode = false;
  editableInfo: Partial<PatientBasicInfoDTO> | null = null;
  activeDocTab = 'scans';

  constructor(
    private patientService: PatientService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadPatientData();
  }

  loadPatientData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get the current patient's email from localStorage using the service
    const userEmail = this.localStorageService.getItem('userEmail');
    if (!userEmail) {
      this.errorMessage = 'No user email found. Please login again.';
      this.isLoading = false;
      return;
    }

    this.patientService.getCurrentPatient(userEmail).subscribe({
      next: (response) => {
        const cin = response.cin;
        this.loadBasicInfoAndProfile(cin);
      },
      error: (err) => {
        this.handleError(err, 'Failed to fetch current patient data');
      }
    });
  }

  private loadBasicInfoAndProfile(cin: string): void {
    // Load basic info
    this.patientService.getPatientBasicInfo(cin).subscribe({
      next: (basicInfo) => {
        this.patientBasicInfo = basicInfo;
        this.loadFullProfile(cin);
      },
      error: (err) => {
        this.handleError(err, 'Failed to load basic patient information');
      }
    });
  }

  private loadFullProfile(cin: string): void {
    // Load full profile
    this.patientService.getPatientProfileByCin(cin).subscribe({
      next: (profile) => {
        this.patientProfile = profile;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err, 'Failed to load patient profile');
      }
    });
  }

  handleError(error: any, defaultMessage: string): void {
    console.error(error);
    this.isLoading = false;
    this.errorMessage = error.error?.message || error.message || defaultMessage;
    setTimeout(() => this.errorMessage = '', 5000);
  }

  enableEditMode(): void {
    if (!this.patientBasicInfo) return;

    this.isEditMode = true;
    this.editableInfo = {
      email: this.patientBasicInfo.email,
      phone: this.patientBasicInfo.phone,
      address: this.patientBasicInfo.address
    };
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.editableInfo = null;
  }

  updateBasicInfo(): void {
    if (!this.patientBasicInfo || !this.editableInfo) return;

    this.isLoading = true;
    const updatedInfo: PatientBasicInfoDTO = {
      ...this.patientBasicInfo,
      ...this.editableInfo
    };

    this.patientService.updatePatientBasicInfo(this.patientBasicInfo.cin, updatedInfo).subscribe({
      next: () => {
        this.patientBasicInfo = updatedInfo;
        this.isLoading = false;
        this.isEditMode = false;
        this.successMessage = 'Patient information updated successfully';
        setTimeout(() => this.successMessage = '', 3000);

        // Update email in localStorage if it was changed
        // @ts-ignore
        if (this.editableInfo.email && this.editableInfo.email !== this.patientBasicInfo.email) {
          // @ts-ignore
          this.localStorageService.setItem('userEmail', this.editableInfo.email);
        }
      },
      error: (err) => {
        this.handleError(err, 'Failed to update patient information');
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getItemCount(items: any[] | undefined): number {
    return items ? items.length : 0;
  }

  setActiveDocTab(tab: string): void {
    this.activeDocTab = tab;
  }

  viewFile(url: string): void {
    if (!url) {
      this.errorMessage = 'No file URL available';
      setTimeout(() => this.errorMessage = '', 3000);
      return;
    }
    window.open(url, '_blank');
  }
}
