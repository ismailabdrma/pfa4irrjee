// src/app/auth/verify-otp/verify-otp.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalStorageService } from '../../services/local-storage.service'; // Add this import

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  otpForm: FormGroup;
  errorMessage: string = '';
  email: string = '';
  isSubmitting: boolean = false;
  debugInfo: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService // Add this service
  ) {
    // Initialize OTP Form
    this.otpForm = this.fb.group({
      otpCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    // Retrieve the pending email for OTP verification
    this.email = this.authService.getPendingEmail();
    console.log('OTP page loaded for email:', this.email);

    // Redirect to login if no pending email
    if (!this.email) {
      console.log('No pending email found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  onSubmit(): void {
    if (this.otpForm.invalid) {
      this.errorMessage = 'Please enter a valid OTP code.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.debugInfo = '';
    const otpCode = this.otpForm.value.otpCode.trim();
    console.log('Submitting OTP:', otpCode, 'for email:', this.email);

    // Use the updated verifyOtp method
    this.authService.verifyOtp(this.email, otpCode).subscribe({
      next: (response: any) => {
        console.log('OTP verification response:', response);
        this.isSubmitting = false;

        // Add debug info
        this.debugInfo = 'Response received: ' + JSON.stringify(response);

        if (response) {
          const { token, role } = response;

          if (token && role) {
            console.log('OTP verified successfully, redirecting to dashboard for role:', role);

            // IMPORTANT: Save the authentication token
            this.authService.saveToken(token);

            // IMPORTANT: Save email to localStorage
            this.localStorageService.setItem('userEmail', this.email);

            // Save CIN if available in the response
            if (response.cin) {
              this.localStorageService.setItem('userCin', response.cin);
            }

            // Save role to localStorage
            this.localStorageService.setItem('userRole', role);

            // Log what we saved
            console.log('Saved to localStorage:', {
              email: this.email,
              token: token ? `${token.substring(0, 10)}...` : 'none',
              role: role || 'none',
              cin: response.cin || 'none'
            });

            // Force a small delay before redirection
            setTimeout(() => {
              try {
                // Use the correct routes from your app.routes.ts
                switch (role) {
                  case "ADMIN":
                    this.router.navigate(["/admin"]);
                    break;
                  case "DOCTOR":
                    this.router.navigate(["/doctor"]);
                    break;
                  case "PHARMACIST":
                    this.router.navigate(["/pharmacist"]);
                    break;
                  case "PATIENT":
                    this.router.navigate(["/patient"]);
                    break;
                  default:
                    this.router.navigate(["/home"]);
                }
              } catch (e) {
                console.error('Navigation error:', e);
                this.errorMessage = 'Error during navigation. Please try again.';
              }
            }, 500);
          } else {
            this.errorMessage = 'Error: Role or token is missing in the response.';
          }
        } else {
          this.errorMessage = 'Error: Empty response received.';
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('OTP Verification Error:', err);
        this.errorMessage = err?.error?.message || 'Invalid or expired OTP code.';
        this.debugInfo = 'Error: ' + JSON.stringify(err);
      }
    });
  }

  resendOtp(): void {
    this.authService.verifyOtp(this.email, '').subscribe({
      next: () => {
        alert('OTP code has been resent to your email.');
      },
      error: () => {
        this.errorMessage = 'Error sending OTP code.';
      }
    });
  }

  // Manual navigation method for testing
  goToDashboard(): void {
    const role = prompt('Enter your role (ADMIN, DOCTOR, PATIENT, PHARMACIST):');
    if (role) {
      // Save role and email to localStorage for testing
      this.localStorageService.setItem('userRole', role.toUpperCase());
      this.localStorageService.setItem('userEmail', this.email || 'test@example.com');

      switch (role.toUpperCase()) {
        case "ADMIN":
          this.router.navigate(["/admin"]);
          break;
        case "DOCTOR":
          this.router.navigate(["/doctor"]);
          break;
        case "PHARMACIST":
          this.router.navigate(["/pharmacist"]);
          break;
        case "PATIENT":
          this.router.navigate(["/patient"]);
          break;
        default:
          this.router.navigate(["/home"]);
      }
    }
  }
}
