import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private location: Location
  ) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  goBack(): void {
    this.location.back();
    this.isMenuOpen = false; // Close mobile menu when navigating back
  }

  logout(): void {
    this.authService.logout();
    this.isMenuOpen = false; // Close mobile menu on logout
  }
}
