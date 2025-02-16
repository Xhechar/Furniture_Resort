import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionType, Category } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';

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

  constructor(private ms: ModalService) { }
  
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
  }

  submitCategory(category: Category) {
    console.log(category);
  }
}
