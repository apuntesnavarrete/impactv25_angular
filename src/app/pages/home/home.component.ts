import { Component } from '@angular/core';
import { MenuGeneralComponent } from "../../components/menu-general/menu-general.component";
import { MenuMainComponent } from "../../components/menu-main/menu-main.component";

@Component({
  selector: 'app-home',
  imports: [MenuMainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
