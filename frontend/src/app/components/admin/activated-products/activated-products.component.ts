import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { Router } from '@angular/router';
import { Product } from '../../../interfaces/interfaces';
import { ModalService } from '../../../services/modal.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ProductsService } from '../../../services/products.service';

@Component({
  selector: 'app-activated-products',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './activated-products.component.html',
  styleUrl: './activated-products.component.css'
})
export class ActivatedProductsComponent implements OnChanges, OnInit {
  selectedProducts: string[] = [];
  deletedProductId!: string;

  message!: string;
  action!: string;

  selectedMenuIndex: number | null = null;
  selectedProduct: number | null = null;

  private previousLength = 0;

  products: Product[] = [];

  showModal = false;
  furnitureName = '';
  animationState: 'visible' | 'void' = 'void';

  constructor(private ms: ModalService, private router: Router, private ps: ProductsService, private ns: NotificationsService, private el: ElementRef) {
    this.getProducts();
  }

  ngOnInit(): void {
    this.getProducts();
  }

  openDeleteModal(name: string = '', ProductId: string = '', message: string = '', action: string) {
    this.message = message;
    this.action = action;
    this.deletedProductId = ProductId;
    this.furnitureName = name;
    this.showModal = true;
    this.el.nativeElement.classList.remove('modal-closing');
  }
  
  hideModal() {
    this.el.nativeElement.classList.add('modal-closing');
    setTimeout(() => {
      this.showModal = false;
      this.el.nativeElement.classList.remove('modal-closing');
    }, 300);
  }
  
  confirmDelete() {
    if (this.action) {
      switch (this.action) {
        case 'delete single': {
          if (this.deletedProductId) {
            this.ps.deleteSingleProduct(this.deletedProductId).subscribe({
              next: (response) => {
                if (response.success) {
                  this.ns.showMessage(response.message as string, true);
                  this.getProducts();
                } else {
                  this.ns.showMessage(response.error as string, false);
                }
              },
              error: (error) => {
                this.ns.showMessage(error.error.error as string, false);
              }
            });
          }
          break;
        }
          
        case 'delete multiple': {
          this.deleteSelected();
          break;
        }
          
        case 'add to offer': {
          this.addToOffer();
          break;
        }
          
        case 'add flush sale': {
          this.addFlushSale();
          break;
        }
          
        case 'enable custom payment': {
          this.enableCustomPayment();
          break;
        }
          
        case 'activate selected': {
          this.activateSelected();
          break;
        }
          
        case 'delete selected': {
          this.deleteSelected();
          break;
        }
          
        default: {
          break;
        }
      }
    }
    this.hideModal();
  }
  
  setUpdateValues(ProductId: string) {
    this.ms.updateProductComponent(true, this.products.filter(p => p.ProductId === ProductId)[0]);
    this.router.navigate(['/admin/products/new-product']);
  }

  toggleMenu(index: number): void {
    if (this.selectedMenuIndex === index) {
      this.selectedMenuIndex = null;
    } else {
      this.selectedMenuIndex = index;
    }
  }

  closeMenu(): void {
    this.selectedMenuIndex = null;
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
          this.products = (response.products as Product[]).filter(p => p.IsActivated);
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  activateProduct(ProductId: string) {
    this.ps.toggleActivationStatus(ProductId).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.closeMenu();
  }

  setProductCustomizable(ProductId: string) {
    this.ps.toggleCustomisationOfSingleProduct(ProductId).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.closeMenu();
  }

  toggleOnOffer(ProductId: string) {
    this.ps.toggleOffer(ProductId).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.closeMenu();
  }

  toggleOnFlushSale(ProductId: string) {
    this.ps.toggleFlushSale(ProductId).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.closeMenu();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedProducts']) {
      if (this.previousLength > 0 && this.selectedProducts.length === 0) {
        this.addHidingClass();
      }
      
      this.previousLength = this.selectedProducts.length;
    }
  }
  private addHidingClass() {
    const buttons = this.el.nativeElement.querySelectorAll('.button-u');
    buttons.forEach((button: HTMLElement, index: number) => {
      button.classList.add('hiding');
      button.style.animationDelay = (0.1 * (buttons.length - index - 1)) + 's';
    });
  }

  addToOffer() {
    this.ps.toggleOnOfferOfMultipleProducts(this.selectedProducts).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.selectedProducts = [];
  }
  
  addFlushSale() {
    this.ps.toggleFlushSaleOfMultipleProducts(this.selectedProducts).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.selectedProducts = [];
  }
  
  enableCustomPayment() {
    this.ps.toggleMultipleCustomisationOfProducts(this.selectedProducts).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.selectedProducts = [];
  }
  
  activateSelected() {
    this.ps.toggleActivationOfMultipleProducts(this.selectedProducts).subscribe({
      next: (value) => {
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.selectedProducts = [];
  }

  deleteSelected() {
    this.ps.deleteMultipleProducts(this.selectedProducts).subscribe({
      next: (value) => {
        console.log(value);
        
        if (value.success) {
          this.ns.showMessage(value.message as string, value.success);
          setTimeout(() => {
            this.products = [];
            this.getProducts();
          }, 3000);
        } else {
          this.ns.showMessage(value.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
    this.selectedProducts = [];
  }
}
