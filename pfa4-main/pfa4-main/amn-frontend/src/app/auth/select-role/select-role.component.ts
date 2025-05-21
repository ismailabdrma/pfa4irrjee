// select-role.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SelectRoleComponent {
  roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Register as a patient to access your medical records, prescriptions, and appointments',
      icon: '👨‍👩‍👧‍👦',
      path: '/register-patient',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Register as a doctor to manage patient records, create prescriptions, and upload medical documents',
      icon: '👨‍⚕️',
      path: '/register-professional',
      queryParams: { role: 'DOCTOR' },
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'pharmacist',
      title: 'Pharmacist',
      description: 'Register as a pharmacist to process prescriptions and manage medication inventory',
      icon: '💊',
      path: '/register-professional',
      queryParams: { role: 'PHARMACIST' },
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'admin',
      title: 'Administrator',
      description: 'Register as an administrator to manage system users, settings, and access controls',
      icon: '👨‍💼',
      path: '/register-professional',
      queryParams: { role: 'ADMIN' },
      color: 'bg-amber-50 border-amber-200'
    }
  ];
}
