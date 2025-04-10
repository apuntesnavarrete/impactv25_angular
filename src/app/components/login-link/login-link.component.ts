import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-link',
  imports: [RouterModule,CommonModule],
  templateUrl: './login-link.component.html',
  styleUrl: './login-link.component.css',
  standalone: true,

})
export class LoginLinkComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}


