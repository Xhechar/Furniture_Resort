import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionType, Category } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';
import { CategoryService } from '../../services/category.service';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  operation: boolean = false;
  submitAction: string = '';
  inputValue: string = '';

  constructor(private ms: ModalService, private cs: CategoryService, private ns: NotificationsService) { }
  
  ngOnInit(): void {
    this.ms.modalOperation$.subscribe(res => {
      if (!res) {
        this.operation = false;
        this.submitAction = '';
        this.inputValue = '';
      } else {
        this.operation = res.operation;
        this.submitAction = res.submitAction;
        this.inputValue = res.inputValue;
      }
    })
  }

  closeModal(): void {
    this.ms.closeModal({ operation: false, submitAction: '', inputValue: '' });
    this.operation = false;
  }

  submitCategory(category: Category) {
    if (this.submitAction !== 'Update') {
      this.cs.createCategory(category).subscribe({
        next: (res) => {
          if (res.success) {
            this.ns.showMessage(res.message as string, true);
          } else {
            this.ns.showMessage(res.error as string, false);
          }
        },
        error: (err) => {
          this.ns.showMessage(err.error.error as string, false);
        }
      });
    } else {
      this.cs.updateCategory(this.inputValue.split(', ')[1], category).subscribe({
        next: (res) => {
          if (res.success) {
            this.ns.showMessage(res.message as string, res.success);
          } else {
            this.ns.showMessage(res.error as string, false);
          }
        },
        error: (err) => {
          this.ns.showMessage(err.error.error as string, false);
        }
      });
    }

    this.ms.closeModal({ operation: false, submitAction: '', inputValue: '' });
    this.ns.triggerRefreshState();
    console.log("after closing modal, trigger refreh shtould be true");
    
    setTimeout(() => {
      this.ns.resetTriggerState();
      console.log("after reseting trigger refreh should be false after sm time");
      
    }, 3000);
  }
}
