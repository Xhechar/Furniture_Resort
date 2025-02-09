import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
  selectedProductIndex!: number;
  products = [
    {
      ProductName: 'Sofa Set',
      Category: 'Furniture',
      Prize: 500,
      StockQuantity: 50,
      StockLimit: 10,
      CustomPrize: 750,
      IsActivated: true,
      DateCreated: new Date('2023-12-25'),
      IsCustommable: true,
      OnOffer: true,
      OnFlushSale: true,
    },
    {
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
    // Add more products here
  ];
  activeProducts = this.products.filter(product => product.IsActivated);
  offerProducts = this.products.filter(product => product.OnOffer);
  flushSaleProducts = this.products.filter(product => product.OnFlushSale);
  containerpDisplay = {
    'display': 'block'
  };

  toggleActivation(index: number) {
    this.selectedProductIndex = index;
  }

  performAction(action: string, product: any) {
    console.log(`Performing ${action} on`, product);
    // Implement functionality for Add to Flush, Offer, etc.
  }

  setContainerDisplay() {
    this.containerpDisplay = {
      'display': 'none'
    };
  }
}
