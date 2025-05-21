// auth.service.ts
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, BehaviorSubject, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { LocalStorageService } from "./local-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "http://localhost:8080/api/auth";
  private tokenKey = "auth_token";
  private emailKey = "pending_email";
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  /**
   * Check authentication status on app initialization
   */
  checkAuthStatus(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = this.parseToken(token);
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          this.userSubject.next({
            email: decodedToken.sub,
            role: decodedToken.role
          });
        } else {
          this.logout(); // Token expired
        }
      } catch (e) {
        this.logout(); // Invalid token
      }
    }
  }

  /**
   * Register Patient
   */
  registerPatient(data: any): Observable<any> {
    const payload = { ...data, role: "PATIENT" };
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(error => {
        console.error("Registration error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register Doctor
   */
  registerDoctor(data: any): Observable<any> {
    const payload = { ...data, role: "DOCTOR" };
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(error => {
        console.error("Registration error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register Pharmacist
   */
  registerPharmacist(data: any): Observable<any> {
    const payload = { ...data, role: "PHARMACIST" };
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(error => {
        console.error("Registration error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Register Admin
   */
  registerAdmin(data: any): Observable<any> {
    const payload = { ...data, role: "ADMIN" };
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError(error => {
        console.error("Registration error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Login
   */
  // auth.service.ts - login method
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Don't save the token here - we'll save it after OTP verification
        // Only store the email for OTP verification
        this.setPendingEmail(credentials.email);
      }),
      catchError(error => {
        console.error("Login error:", error);
        return throwError(() => error);
      })
    );
  }


  verifyOtp(email: string, otpCode: string): Observable<any> {
    console.log(`Sending OTP verification request for email: ${email}, code: ${otpCode}`);

    // Use query parameters as in your original code
    return this.http.post(`${this.apiUrl}/verify-otp?email=${email}&otpCode=${otpCode}`, {}).pipe(
      tap((response: any) => {
        console.log('OTP verification response received:', response);
        const { token, role } = response;
        if (token) {
          console.log('Saving token and updating user state');
          this.saveToken(token);

          // Update this to use the same key as in PatientComponent
          this.localStorageService.setItem("userEmail", email);

          // Save role if needed
          this.localStorageService.setItem("userRole", role);

          // Also save CIN if it's in the response
          if (response.cin) {
            this.localStorageService.setItem("userCin", response.cin);
          }

          this.userSubject.next({
            email: email,
            role: role
          });
        }
      }),
      catchError(error => {
        console.error("OTP verification error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Save Token
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get Token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Set Pending Email
   */
  setPendingEmail(email: string): void {
    localStorage.setItem(this.emailKey, email);
  }

  /**
   * Get Pending Email
   */
  getPendingEmail(): string {
    return localStorage.getItem(this.emailKey) || "";
  }

  /**
   * Get User Email
   */
  getUserEmail(): string | null {
    return this.localStorageService.getItem("user_email");
  }

  /**
   * Get Current User
   */
  getCurrentUser(): any {
    return this.userSubject.value;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.userSubject.value;
  }

  /**
   * Redirect to Dashboard
   */
  redirectToDashboard(role: string): void {
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
        this.router.navigate(["/login"]);
    }
  }

  /**
   * Get Dashboard Route
   */
  getDashboardRoute(): string {
    const user = this.getCurrentUser();
    if (!user) return '/auth-choice';

    switch(user.role) {
      case 'DOCTOR': return '/doctor';
      case 'PATIENT': return '/patient';
      case 'PHARMACIST': return '/pharmacist';
      case 'ADMIN': return '/admin';
      default: return '/auth-choice';
    }
  }

  /**
   * Logout
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.emailKey);
    this.localStorageService.removeItem("user_email");
    this.userSubject.next(null);
    this.router.navigate(["/home"]);
  }

  /**
   * Parse JWT Token
   */
  private parseToken(token: string): any {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      console.error("Token parsing error:", e);
      return null;
    }
  }
  // In your AuthService, add a method to save user email after successful login
  saveUserEmail(email: string): void {
    this.localStorageService.setItem('userEmail', email);
  }

// And possibly add a method to save CIN if you have it in the response
  saveCin(cin: string): void {
    this.localStorageService.setItem('userCin', cin);
  }
}
