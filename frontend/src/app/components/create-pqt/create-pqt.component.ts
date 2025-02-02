import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductQuantityTime } from '../../interfaces/interfaces';

@Component({
  selector: 'app-create-pqt',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-pqt.component.html',
  styleUrl: './create-pqt.component.css'
})
export class CreatePqtComponent {

  createPQT(pqt: Partial<ProductQuantityTime>) {
    console.log('New ProductQuantityTime created:', pqt);
  }
}
