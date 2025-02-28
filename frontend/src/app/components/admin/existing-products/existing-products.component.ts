import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/interfaces';
import { ProductsService } from '../../../services/products.service';
import { NotificationsService } from '../../../services/notifications.service';

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

  products: Product[] = [];

  constructor(private ms: ModalService, private router: Router, private ps: ProductsService, private ns: NotificationsService) {
    this.getProducts();
  }
  
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

  getProducts() {
    this.ps.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.products as Product[];
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }
}
