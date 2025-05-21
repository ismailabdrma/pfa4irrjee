// auth-choice.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth-choice',
  templateUrl: './auth-choice.component.html',
  styleUrls: ['./auth-choice.component.css'],
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
export class AuthChoiceComponent {
  userTypes = [
    {
      type: 'patient',
      title: 'Patient',
      description: 'Access your medical records, prescriptions, and appointments',
      icon: '👨‍👩‍👧‍👦',
      registerPath: '/register-patient',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      type: 'doctor',
      title: 'Doctor',
      description: 'Manage patient records, prescriptions, and medical documents',
      icon: '👨‍⚕️',
      registerPath: '/register-professional',
      color: 'bg-green-50 border-green-200'
    },
    {
      type: 'pharmacist',
      title: 'Pharmacist',
      description: 'Process prescriptions and manage medication inventory',
      icon: '💊',
      registerPath: '/register-professional',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      type: 'admin',
      title: 'Administrator',
      description: 'Manage system users, settings, and access controls',
      icon: '👨‍💼',
      registerPath: '/register-professional',
      color: 'bg-amber-50 border-amber-200'
    }
  ];
}
