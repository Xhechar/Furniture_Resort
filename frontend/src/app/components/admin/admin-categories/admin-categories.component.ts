import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent {
  categories = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
    { id: 3, name: 'Clothing' },
  ];

  // Placeholder methods for update and delete actions
  onUpdateCategory(id: number): void {
    alert(`Update category with ID: ${id}`);
  }

  onDeleteCategory(id: number): void {
    alert(`Delete category with ID: ${id}`);
  }
}
