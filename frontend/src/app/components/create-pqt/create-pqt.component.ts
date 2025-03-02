import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductQuantityTime } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';
import { PqtService } from '../../services/pqt.service';

@Component({
  selector: 'app-create-pqt',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-pqt.component.html',
  styleUrl: './create-pqt.component.css'
})
export class CreatePqtComponent implements OnInit {
  furnitureName: string = ''
  pqtShow: boolean = false;
  pqtData!: ProductQuantityTime;
  pqtCount: number = 0;
  originalCount: number = 1;

  @ViewChild('productQtForm') productQtForm!: NgForm;

  constructor(private ms: ModalService, private pqt: PqtService) { }
  
  ngOnInit(): void {
    this.ms.pqtModalDetails$.subscribe(res => {
      if (!res) {
        this.pqtShow = false;
      } else {
        this.pqtShow = res.pqtShow;
        this.pqtData = res.pqtData as ProductQuantityTime;
        this.furnitureName = res.pqtFurnitureName;
        this.pqtCount = res.pqtCount;
      }
    })
  }
  createPQT(pqt: Partial<ProductQuantityTime>) {
    console.log('New ProductQuantityTime created:', pqt);

    if (this.pqtCount !== this.originalCount) {
      this.setModal();
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
