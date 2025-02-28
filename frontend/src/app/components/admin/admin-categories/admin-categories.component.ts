import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../interfaces/interfaces';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from '../../notifications/notifications.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.css'
})
export class AdminCategoriesComponent implements OnInit{
  triggerRefresh!: boolean;
  categories!: Category[];

  constructor(private ms: ModalService, private cs: CategoryService, private ns: NotificationsService) { 
    this.displayCategories();
  }

  ngOnInit(): void {
    this.ns.triggerRefresh$.subscribe(res => this.triggerRefresh = res);
    if (this.triggerRefresh) {
      this.displayCategories();
    }
  }
  
  displayCategories() {
    this.cs.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.categories as Category[];
        } else {
          this.ns.showMessage(response.message as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }
  displayModal(): void {
    this.ms.openModal({ operation: true, submitAction: 'Add', inputValue: '' });
  }

  displayUpdateModal(CategoryName: string): void {
    this.ms.openModal({ operation: true, submitAction: 'Update', inputValue: CategoryName });
  }
}
