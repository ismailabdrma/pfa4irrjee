import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Subscribe to auth changes
    this.authService.user$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    // Check auth status on initialization
    this.authService.checkAuthStatus();
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.location.back();
  }
}
