// register-professional.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: "app-register-professional",
  templateUrl: "./register-professional.component.html",
  styleUrls: ["./register-professional.component.css"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterProfessionalComponent implements OnInit {
  registerForm: FormGroup;
  roles = ["DOCTOR", "PHARMACIST", "ADMIN"];
  errorMessage = "";
  isSubmitting = false;
  selectedRole: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      fullName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      phone: ["", Validators.required],
      role: ["", Validators.required],
      matricule: ["", Validators.required],
      specialty: [""], // Only required for DOCTOR
    });
  }

  ngOnInit(): void {
    // Get role from query params if available
    this.route.queryParams.subscribe(params => {
      if (params['role'] && this.roles.includes(params['role'])) {
        this.selectedRole = params['role'];
        this.registerForm.get('role')?.setValue(params['role']);
      }
    });

    // Adjust form controls based on role selection
    this.registerForm.get("role")?.valueChanges.subscribe((role) => {
      const specialtyControl = this.registerForm.get("specialty");

      if (role === "DOCTOR") {
        specialtyControl?.setValidators([Validators.required]);
        specialtyControl?.updateValueAndValidity();
      } else {
        specialtyControl?.clearValidators();
        specialtyControl?.setValue(""); // Clear specialty if not DOCTOR
        specialtyControl?.updateValueAndValidity();
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = "";

    // Prepare form data and ensure correct field mapping
    const formData = {
      ...this.registerForm.value,
      name: this.registerForm.value.fullName,
      specialization: this.registerForm.value.specialty,
    };

    // Clean up unnecessary fields
    delete formData.fullName;
    delete formData.specialty;

    // Set status to PENDING for DOCTOR and PHARMACIST
    if (formData.role === "DOCTOR" || formData.role === "PHARMACIST") {
      formData.status = "PENDING";
    }

    // Call appropriate registration method based on role
    switch (formData.role) {
      case "DOCTOR":
        this.authService.registerDoctor(formData).subscribe({
          next: () => this.handleSuccess('doctor'),
          error: (err) => this.handleError(err),
        });
        break;
      case "PHARMACIST":
        this.authService.registerPharmacist(formData).subscribe({
          next: () => this.handleSuccess('pharmacist'),
          error: (err) => this.handleError(err),
        });
        break;
      case "ADMIN":
        this.authService.registerAdmin(formData).subscribe({
          next: () => this.handleSuccess('admin'),
          error: (err) => this.handleError(err),
        });
        break;
      default:
        this.errorMessage = "Invalid role.";
        this.isSubmitting = false;
    }
  }

  private handleSuccess(type: string): void {
    this.isSubmitting = false;
    this.router.navigate(["/login"], {
      queryParams: { registered: true, type: type }
    });
  }

  private handleError(error: any): void {
    this.isSubmitting = false;
    console.error("Registration error:", error);
    this.errorMessage = error?.error?.message || "Registration failed. Please try again.";
  }

  getRoleTitle(): string {
    if (!this.selectedRole) return 'Professional';

    switch(this.selectedRole) {
      case 'DOCTOR': return 'Doctor';
      case 'PHARMACIST': return 'Pharmacist';
      case 'ADMIN': return 'Administrator';
      default: return 'Professional';
    }
  }
}
