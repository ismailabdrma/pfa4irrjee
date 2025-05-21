import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class HomeComponent {
  features = [
    {
      icon: '📋',
      title: 'Electronic Medical Records',
      description: 'Securely store and access patient medical records from anywhere, anytime.'
    },
    {
      icon: '💊',
      title: 'Prescription Management',
      description: 'Create, track, and manage prescriptions with ease and accuracy.'
    },
    {
      icon: '🔍',
      title: 'Medical History Tracking',
      description: 'Comprehensive view of patient medical history for better care decisions.'
    },
    {
      icon: '📊',
      title: 'Healthcare Analytics',
      description: 'Gain insights from medical data to improve patient outcomes.'
    },
    {
      icon: '🔒',
      title: 'Secure Data Storage',
      description: 'Your medical data is encrypted and securely stored with the highest standards.'
    },
    {
      icon: '📱',
      title: 'Mobile Access',
      description: 'Access your medical information on any device, anywhere.'
    }
  ];

  testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Cardiologist',
      image: '/assets/images/doctor1.jpg',
      quote: 'This system has revolutionized how I manage patient records. It\'s intuitive and saves me hours every week.'
    },
    {
      name: 'James Wilson',
      role: 'Patient',
      image: '/assets/images/patient1.jpg',
      quote: 'I can now access my medical history and prescriptions easily. It\'s made managing my healthcare so much simpler.'
    },
    {
      name: 'Lisa Chen',
      role: 'Pharmacist',
      image: '/assets/images/pharmacist1.jpg',
      quote: 'The prescription management system is excellent. It reduces errors and improves our workflow significantly.'
    }
  ];
}
