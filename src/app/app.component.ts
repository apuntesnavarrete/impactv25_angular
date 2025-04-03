import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginLinkComponent } from './components/login-link/login-link.component';
import { MenuGeneralComponent } from './components/menu-general/menu-general.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, LoginLinkComponent, MenuGeneralComponent], // Importamos todo
})
export class AppComponent {}


