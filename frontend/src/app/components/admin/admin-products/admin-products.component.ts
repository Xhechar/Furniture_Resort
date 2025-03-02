import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { ProductsService } from '../../../services/products.service';
import { Product } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  selectedProductIndex!: number;
  products: Product[] = [];

  activeProducts : Product[] = [];
  offerProducts : Product[] = [];
  flushSaleProducts : Product[] = [];
  containerpDisplay = {
    'display': 'block'
  };

  constructor(private ms: ModalService, private ps: ProductsService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  toggleActivation(index: number) {
    this.selectedProductIndex = index;
  }

  getProducts() {
    this.ps.getAllProducts().subscribe({
      next: (value) => {
        if (value.success) {          
          this.products = value.products as Product[];
          this.activeProducts = this.products.filter(product => product.IsActivated);
          this.offerProducts = this.products.filter(product => product.OnOffer);
          this.flushSaleProducts = this.products.filter(product => product.OnFlushSale);
        }
      }
    })
  }

  removeFormValues() {
    this.ms.resetProductComponent();
  }

  performAction(action: string, product: any) {
    console.log(`Performing ${action} on`, product);
  }

  setContainerDisplay() {
    this.containerpDisplay = {
      'display': 'none'
    };
  }
}
