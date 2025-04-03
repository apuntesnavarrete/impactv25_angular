import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginLinkComponent } from './login-link/login-link.component';
import { MenuGeneralComponent } from './menu-general/menu-general.component';
import { MenuMainComponent } from './menu-main/menu-main.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, LoginLinkComponent, MenuGeneralComponent], // Importamos todo
})
export class AppComponent {}


