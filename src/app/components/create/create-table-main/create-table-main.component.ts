import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  searchQuery: string = '';

  filteredItems() {
    return this.items.filter(i =>
      i.name?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
