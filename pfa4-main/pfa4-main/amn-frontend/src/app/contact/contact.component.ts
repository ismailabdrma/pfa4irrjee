import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitForm() {
    console.log('Form submitted:', this.contactForm);
    // Reset form after submission
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
}
