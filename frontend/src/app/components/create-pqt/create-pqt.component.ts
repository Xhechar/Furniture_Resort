import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductQuantityTime } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';
import { PqtService } from '../../services/pqt.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-create-pqt',
  standalone: true,
  imports: [FormsModule, CommonModule, NotificationsComponent],
  templateUrl: './create-pqt.component.html',
  styleUrl: './create-pqt.component.css'
})
export class CreatePqtComponent implements OnInit {
  furnitureName: string = ''
  pqtShow: boolean = false;
  pqtData!: ProductQuantityTime;
  pqtCount: number = 0;
  originalCount: number = 1;
  ProductId!: string;

  @ViewChild('productQtForm') productQtForm!: NgForm;

  constructor(private ms: ModalService, private pqt: PqtService, private ns: NotificationsService) { }
  
  ngOnInit(): void {
    this.ms.pqtModalDetails$.subscribe(res => {
      if (!res) {
        this.pqtShow = false;
      } else {
        this.pqtShow = res.pqtShow;
        this.pqtData = res.pqtData as ProductQuantityTime;
        this.furnitureName = res.pqtFurnitureName.split(', ')[0];
        this.ProductId = res.pqtFurnitureName.split(', ')[1];
        this.pqtCount = res.pqtCount;
      }
    });
  }
  createPQT(pqt: ProductQuantityTime) {
    let notification = this.ns;
    let ProductId = this.ProductId;
    let ms = this.ms;
    if (this.pqtCount >= this.originalCount) {
      this.setModal();
      this.pqt.createPQT(ProductId, pqt).subscribe({
        next(response) {
          if (response.success) {
            notification.showMessage(response.message as string, response.success);
            ms.resetPqtModalDetails();
          } else {
            notification.showMessage(response.error as string, false);
          }
        },
        error(error) {
          notification.showMessage(error.error.error as string, false);
        }
      });
      this.originalCount++;
      this.productQtForm.reset();
    } else {
      this.productQtForm.reset();
      this.resetModal();
      this.closeForm();
    }
  }

  setModal() {
    this.ms.updatePqtModalDetails({
      pqtShow: true,
      pqtData: null,
      pqtCount: this.pqtCount,
      pqtFurnitureName: this.furnitureName
    });
  }

  resetModal() {
    this.ms.updatePqtModalDetails({ pqtShow: false, pqtData: null, pqtCount: 0, pqtFurnitureName: '' });
    this.originalCount = 1;
  }

  closeForm() {
    this.ms.resetPqtModalDetails();
  }
}
