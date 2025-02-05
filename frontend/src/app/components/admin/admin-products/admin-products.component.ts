import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent {
  products = [
    {
      ProductName: 'Sofa Set',
      Category: 'Furniture',
      Prize: 500,
      StockQuantity: 50,
      StockLimit: 10,
      CustomPrize: true,
      IsActivated: true,
      DateCreated: new Date('2023-12-25')
    },
    // Add more products here
  ];

  toggleActivation(product: any) {
    product.IsActivated = !product.IsActivated;
  }

  performAction(action: string, product: any) {
    console.log(`Performing ${action} on`, product);
    // Implement functionality for Add to Flush, Offer, etc.
  }
}
