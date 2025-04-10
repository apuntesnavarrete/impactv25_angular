import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  formData = {
    email: '',
    password: '',
  };

  showSuccess = false;
  showError = false;

  constructor(private http: HttpClient, private router: Router) {}

  private baseUrl = environment.baseUrl;

  async handleSubmit(event: Event) {
    event.preventDefault();
    
    const apiRuta = `${this.baseUrl}/auth/login`;

    try {
      const response: any = await firstValueFrom(
        this.http.post(apiRuta, this.formData)
      );

      localStorage.setItem('token', response.token);
      this.showSuccess = true;

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } catch (error: any) {
      this.showError = true;
      setTimeout(() => {
        this.showError = false;
      }, 3000);
    }
  }
}
