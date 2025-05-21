import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ServicesComponent {
  services = [
    {
      icon: '📋',
      title: 'Electronic Medical Records',
      description: 'Comprehensive digital records of patient health information, including medical history, diagnoses, medications, treatment plans, immunization dates, allergies, radiology images, and laboratory results.',
      features: [
        'Secure storage of patient records',
        'Easy access for authorized personnel',
        'Comprehensive medical history tracking',
        'Digital document management'
      ]
    },
    {
      icon: '💊',
      title: 'Prescription Management',
      description: 'Digital prescription creation, tracking, and management system that connects doctors, patients, and pharmacists for seamless medication management.',
      features: [
        'Digital prescription creation',
        'Medication tracking',
        'Pharmacy integration',
        'Medication history'
      ]
    },
    {
      icon: '🏥',
      title: 'Hospital Integration',
      description: 'Seamless integration with hospital systems to ensure continuity of care and access to critical patient information across healthcare facilities.',
      features: [
        'Cross-facility data sharing',
        'Unified patient records',
        'Streamlined referrals',
        'Coordinated care'
      ]
    },
    {
      icon: '📊',
      title: 'Healthcare Analytics',
      description: 'Advanced analytics tools to help healthcare providers identify trends, improve patient outcomes, and optimize resource allocation.',
      features: [
        'Patient outcome tracking',
        'Treatment efficacy analysis',
        'Resource optimization',
        'Trend identification'
      ]
    },
    {
      icon: '🔒',
      title: 'Secure Patient Portal',
      description: 'A secure online platform where patients can access their medical records, communicate with healthcare providers, and manage appointments.',
      features: [
        'Secure login system',
        'Medical record access',
        'Provider messaging',
        'Appointment scheduling'
      ]
    },
    {
      icon: '📱',
      title: 'Mobile Health Solutions',
      description: 'Mobile applications that allow healthcare providers and patients to access medical information and services on-the-go.',
      features: [
        'Mobile app access',
        'Real-time notifications',
        'Offline capabilities',
        'Cross-device synchronization'
      ]
    }
  ];

  faqs = [
    {
      question: 'How secure is my medical data?',
      answer: 'We implement industry-leading security measures including end-to-end encryption, regular security audits, and strict access controls to ensure your medical data is always protected.'
    },
    {
      question: 'Can multiple healthcare providers access my records?',
      answer: 'Yes, with your permission, multiple healthcare providers can access your records to ensure coordinated care. You have full control over who can view your information.'
    },
    {
      question: 'How do I access my medical records?',
      answer: 'You can access your medical records through our secure patient portal using your unique login credentials. The portal is available 24/7 from any device with internet access.'
    },
    {
      question: 'Is the system compliant with healthcare regulations?',
      answer: 'Yes, our system is fully compliant with all relevant healthcare regulations and standards, including HIPAA and GDPR, ensuring your data is handled according to legal requirements.'
    },
    {
      question: 'Can I download my medical records?',
      answer: 'Yes, you can download your medical records in various formats for personal use or to share with healthcare providers outside our network.'
    }
  ];
}
