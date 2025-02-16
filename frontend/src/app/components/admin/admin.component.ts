import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminSideBarComponent } from './admin-side-bar/admin-side-bar.component';
import { UserTopBarComponent } from '../user/user-top-bar/user-top-bar.component';
import { AdminTopBarComponent } from './admin-top-bar/admin-top-bar.component';
import { CategoryComponent } from '../category/category.component';
import { ModalService } from '../../services/modal.service';
import { ActionType } from '../../interfaces/interfaces';
import { CreatePqtComponent } from '../create-pqt/create-pqt.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AdminSideBarComponent, AdminTopBarComponent, CategoryComponent, CreatePqtComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  operation: boolean = false;
  submitAction: string = '';
  inputValue: string = '';
 
  constructor(private ms: ModalService) { }
  
  ngOnInit(): void {
    this.ms.modalOperation$.subscribe(res => {
      if (!res) {
        this.operation = false;
      } else {
        this.operation = res.operation;
        this.submitAction = res.submitAction;
        this.inputValue = res.inputValue;
      }
    });
  }
}
