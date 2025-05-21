import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AboutComponent {
  team = [
    {
      name: 'Dr. Michael Reynolds',
      role: 'Chief Medical Officer',
      image: '/assets/images/team1.jpg',
      bio: 'Dr. Reynolds has over 20 years of experience in healthcare management and technology integration.'
    },
    {
      name: 'Sarah Thompson',
      role: 'Lead Software Engineer',
      image: '/assets/images/team2.jpg',
      bio: 'Sarah specializes in healthcare software solutions with a focus on security and user experience.'
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Medical Advisor',
      image: '/assets/images/team3.jpg',
      bio: 'Dr. Chen brings clinical expertise to ensure our platform meets the real-world needs of healthcare providers.'
    },
    {
      name: 'Robert Jackson',
      role: 'Data Security Officer',
      image: '/assets/images/team4.jpg',
      bio: 'Robert ensures all patient data is protected with the highest security standards in the industry.'
    }
  ];
}
