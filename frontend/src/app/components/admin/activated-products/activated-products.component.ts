import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-activated-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activated-products.component.html',
  styleUrl: './activated-products.component.css'
})
export class ActivatedProductsComponent {
  selected: number = 0;
  selectedProducts: string[] = [];

  products = [
    {
      ProductId: 'th',
      ProductName: 'Sofa Set',
      Category: 'Furniture',
      Prize: 500,
      StockQuantity: 12,
      StockLimit: 10,
      CustomPrize: 750,
      IsActivated: true,
      DateCreated: new Date('2023-12-25'),
      IsCustommable: true,
      OnOffer: true,
      OnFlushSale: true,
    },
    {
      ProductId: 'thr',
      ProductName: 'Sofa Set',
      Category: 'Furniture',
      Prize: 500,
      StockQuantity: 50,
      StockLimit: 10,
      CustomPrize: true,
      IsActivated: false,
      DateCreated: new Date('2023-12-25'),
      IsCustommable: false,
      OnOffer: true,
      OnFlushSale: false,
    }
  ].filter(p => p.IsActivated);

  setSelectedNumber(index: number) {
    this.selected === 0 ? this.selected = index : this.ResetSelectedNumber();
  }

  ResetSelectedNumber() {
    this.selected = 0;
  }

  setSelectedProduct(ProductId: string) {
    this.selectedProducts.find(id => id === ProductId) === undefined ? this.selectedProducts.push(ProductId) : this.selectedProducts.splice(this.selectedProducts.indexOf(ProductId), 1);
  }
}
