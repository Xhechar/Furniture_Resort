import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryComponent } from '../../category/category.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent {
  constructor(private ms: ModalService) {}
  displayModal(): void {
    this.ms.openModal({ operation: true, submitAction: 'Add', inputValue: '' });
  }

  displayUpdateModal(): void {
    this.ms.openModal({ operation: true, submitAction: 'Update', inputValue: 'Category 1' });
  }
}
