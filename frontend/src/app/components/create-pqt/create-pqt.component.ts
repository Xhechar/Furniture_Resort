import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductQuantityTime } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';

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

  constructor(private ms: ModalService) { }
  
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
  }

  closeForm() {
    this.ms.resetPqtModalDetails();
  }
}
