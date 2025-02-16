import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-existing-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './existing-products.component.html',
  styleUrl: './existing-products.component.css'
})
export class ExistingProductsComponent {
  selected: number = 0;
  selectedProducts: string[] = [];

  products: Product[] = [
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
      ProductImages: '',
      ShortDesc: 'smth',
      LongDesc: 'smth',
      Sizes: 'smth',
      Colour: '#2acbb8',
      Discount: 0,
      MakePeriods: 0,
      Deposit: 0
    },
    {
      ProductId: 'thr',
      ProductName: 'Sofa Seta',
      Category: 'Furniture',
      Prize: 500,
      StockQuantity: 50,
      StockLimit: 10,
      CustomPrize: 600,
      IsActivated: false,
      DateCreated: new Date('2023-12-25'),
      IsCustommable: false,
      OnOffer: true,
      OnFlushSale: false,
      ProductImages: '',
      ShortDesc: 'smth',
      LongDesc: 'smth',
      Sizes: 'smth',
      Colour: '#2acbb8',
      Discount: 0,
      MakePeriods: 0,
      Deposit: 0
    }
  ];

  constructor(private ms: ModalService, private router: Router) { }
  
  setUpdateValues(ProductId: string) {
    this.ms.updateProductComponent(true, this.products.filter(p => p.ProductId === ProductId)[0]);
    this.router.navigate(['/admin/products/new-product']);
  }

  setSelectedNumber(index: number) {
    this.selected === 0 ? this.selected = index : this.ResetSelectedNumber();
  }

  ResetSelectedNumber() {
    this.selected = 0;
  }

  setSelectedProduct(ProductId: string) {
    this.selectedProducts.find(id => id === ProductId) === undefined ? this.selectedProducts.push(ProductId) : this.selectedProducts.splice(this.selectedProducts.indexOf(ProductId), 1);
  }

  displayPqt(ProductName: string, pqtCount: number) {
    this.ms.updatePqtModalDetails({pqtCount, pqtShow: true, pqtData: null, pqtFurnitureName: ProductName})
  }
}
