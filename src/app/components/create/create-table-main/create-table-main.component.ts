import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-table-main',
  standalone: true, // si estás usando componentes standalone
  imports: [FormsModule ,CommonModule,RouterModule],
  templateUrl: './create-table-main.component.html',
  styleUrl: './create-table-main.component.css'
})
export class CreateTableMainComponent {
  @Input() addText: string = '';
  @Input() addLink: string = '';
  @Input() isLoggedIn: boolean = false;
  @Input() columns: { header: string, key: string, type?: string }[] = [];
  @Input() items: any[] = [];
  @Input() imageBasePath: string = '';
@Input() showActions = false;   // 👈 por defecto apagado
@Output() onDelete = new EventEmitter<number>();

 @Input() searchQuery: string = '';

filteredItems() {
  if (!this.searchQuery) return this.items.sort((a, b) => b.id - a.id);

  const query = this.searchQuery.trim().toLowerCase();

  return this.items
    .filter(i => {
      const idStr = i.id.toString();           // aquí conviertes el id a texto
      const matchById = idStr.includes(query); // aquí buscas si incluye la cadena
      const matchByIdName = i.idName?.toLowerCase().includes(query) ?? false;
      const matchByName = i.name?.toLowerCase().includes(query) ?? false;
      const matchByCategoria = i.categorias?.toLowerCase().includes(query) ?? false;

      return matchById || matchByIdName || matchByName || matchByCategoria;
    })
    .sort((a, b) => b.id - a.id);
}

}
