import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-login-link',
  imports: [RouterModule, CommonModule],
  templateUrl: './login-link.component.html',
  styleUrl: './login-link.component.css',
  standalone: true,
})
export class LoginLinkComponent {
  private authService = inject(AuthService); // 👈 Inyecta el servicio

  constructor(private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // 👈 Usa el método del servicio
  }

  logout() {
    this.authService.logout();  // Llama al método logout desde el servicio
  }

}
