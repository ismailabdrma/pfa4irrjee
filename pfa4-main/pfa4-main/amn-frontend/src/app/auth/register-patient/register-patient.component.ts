// register-patient.component.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: "app-register-patient",
  templateUrl: "./register-patient.component.html",
  styleUrls: ["./register-patient.component.css"],
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
export class RegisterPatientComponent {
  registerForm: FormGroup;
  errorMessage = "";
  isSubmitting = false;
  bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      fullName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      phone: ["", Validators.required],
      cin: ["", Validators.required],
      birthDate: ["", Validators.required],
      bloodType: ["", Validators.required],
      emergencyContact: ["", Validators.required],
      allergies: [""],
      chronicDiseases: [""],
      hasHeartProblem: [false],
      hasSurgery: [false],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = "Please fill in all required fields.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = "";

    const payload = {
      ...this.registerForm.value,
      name: this.registerForm.value.fullName,
    };

    this.authService.registerPatient(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(["/login"], {
          queryParams: { registered: true, type: 'patient' }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error(err);
        this.errorMessage = err?.error?.message || "Registration failed. Please try again.";
      },
    });
  }
}
