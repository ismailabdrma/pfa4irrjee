// app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DoctorComponent } from './dashboard/doctor/doctor.component';
import { PatientComponent } from './dashboard/patient/patient.component';
import { PharmacistComponent } from './dashboard/pharmacist/pharmacist.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { AuthChoiceComponent } from './auth/auth-choice/auth-choice.component';
import { SelectRoleComponent } from './auth/select-role/select-role.component';
import { RegisterPatientComponent } from './auth/register-patient/register-patient.component';
import { RegisterProfessionalComponent } from './auth/register-professional/register-professional.component';
import { VerifyOtpComponent } from './auth/verify-otp/verify-otp.component';
import { ConsultationPrescriptionComponent } from './dashboard/doctor/consultation-prescription/consultation-prescription.component';
import { ConsultationDetailComponent } from './dashboard/doctor/consultation-detail/consultation-detail.component';
import { PrescriptionDetailComponent } from './dashboard/doctor/prescription-detail/prescription-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auth-choice', component: AuthChoiceComponent },
  { path: 'select-role', component: SelectRoleComponent },
  { path: 'register-patient', component: RegisterPatientComponent },
  { path: 'register-professional', component: RegisterProfessionalComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'pharmacist', component: PharmacistComponent },
  { path: 'admin', component: AdminComponent },

  // Add these routes
  { path: 'dashboard/doctor/consultation-prescription/:cin/:fullName', component: ConsultationPrescriptionComponent },
  { path: 'dashboard/doctor/consultation/:id', component: ConsultationDetailComponent },
  { path: 'dashboard/doctor/prescription/:id', component: PrescriptionDetailComponent }
];
