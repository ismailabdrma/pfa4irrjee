// src/app/auth/login/login.component.ts
import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { trigger, transition, style, animate } from '@angular/animations';
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
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
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = "";
  isSubmitting = false;
  userType: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageService: LocalStorageService // Added LocalStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // Get user type from query params if available
    this.route.queryParams.subscribe(params => {
      this.userType = params['type'] || null;
    });

    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.authService.getDashboardRoute()]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = "Please enter a valid email and password.";
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = "";
    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (response: any) => {
        console.log('Login response:', response);
        this.isSubmitting = false;

        // Store email in both pending state and localStorage
        this.authService.setPendingEmail(email);
        this.localStorageService.setItem('userEmail', email);
        console.log('Email stored for OTP and locally:', email);

        // Store CIN if available in the response
        if (response && response.cin) {
          this.localStorageService.setItem('userCin', response.cin);
          console.log('CIN stored locally:', response.cin);
        }

        // Check if we have a complete response with token and role
        if (response && response.token && response.role === "ADMIN") {
          // If it's an admin, redirect directly to dashboard
          this.authService.saveToken(response.token);
          this.authService.redirectToDashboard(response.role);
        } else {
          // For all other cases, go to OTP verification
          this.router.navigate(["/verify-otp"]);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error("Login Error:", err);
        this.errorMessage = err?.error?.message || "Invalid email or password.";
      },
    });
  }

  goToOtpManually(): void {
    const email = this.loginForm.value.email;
    if (email) {
      this.authService.setPendingEmail(email);
      this.localStorageService.setItem('userEmail', email); // Also store in localStorage
      this.router.navigate(['/verify-otp']);
    } else {
      this.errorMessage = "Please enter your email first.";
    }
  }

  getUserTypeTitle(): string {
    if (!this.userType) return 'Account';

    return this.userType.charAt(0).toUpperCase() + this.userType.slice(1);
  }
}
