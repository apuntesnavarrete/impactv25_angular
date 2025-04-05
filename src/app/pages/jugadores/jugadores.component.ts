import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JugadoresApiService } from '../../service/peticiones/jugadores-api.service';

@Component({
  selector: 'app-jugadores',
  templateUrl: './jugadores.component.html',
  styleUrl: './jugadores.component.css',
  standalone: true,
  imports: [CommonModule],
  providers: [
    JugadoresApiService // Solo servicios específicos del componente
  ]
})
export class JugadoresComponent implements OnInit {
  private jugadoresApiService = inject(JugadoresApiService);

  ngOnInit(): void {
    this.jugadoresApiService.getPlayers().subscribe(config => {
      console.log(config);
    });
  }
}