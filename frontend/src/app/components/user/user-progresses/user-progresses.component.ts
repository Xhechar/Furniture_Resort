import { Component, OnInit } from '@angular/core';
import { CustomOrder, Progress } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-progresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-progresses.component.html',
  styleUrl: './user-progresses.component.css'
})
export class UserProgressesComponent implements OnInit {
  // Dummy data for custom orders
  customOrders: CustomOrder[] = [
    {
      CustomOrderId: 'CO001',
      ProductId: 'P001',
      UserId: 'U001',
      Price: 5000,
      Discount: 500,
      Quantity: 1,
      Deposit: 1000,
      Balance: 3500,
      DateCreated: new Date().toISOString(),
      DateModified: new Date(),
      DeliveryStatus: false,
      Progresses: [
        {
          ProgressId: 'PR001',
          ProductId: 'P001',
          UserId: 'U001',
          CustomOrderId: 'CO001',
          DateCreated: new Date().toISOString(),
          MaterialsImages: 'mat1.jpg,mat2.jpg,mat3.jpg',
          ProgressImages: 'prog1.jpg,prog2.jpg',
          FinalImages: 'final1.jpg,final2.jpg',
          Status: 'In Progress',
          DateCompleted: new Date()
        }
      ],
      Product: {
        ProductId: 'P001',
        ProductName: 'Modern Wooden Dining Table',
        ProductImages: 'https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg, https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg',
        ShortDesc: 'Elegant wooden dining table for modern homes',
        LongDesc: 'Handcrafted wooden dining table with sleek design',
        Sizes: 'Large',
        Category: 'Furniture',
        Colour: 'Walnut Brown',
        Prize: 5000,
        StockQuantity: 1,
        StockLimit: 0,
        CustomPrize: 0,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date(),
        IsActivated: false,
        IsCustommable: false
      }
    },
    {
      CustomOrderId: 'CO002',
      ProductId: 'P002',
      UserId: 'U001',
      Price: 7500,
      Discount: 750,
      Quantity: 1,
      Deposit: 2000,
      Balance: 5500,
      DateCreated: new Date().toISOString(),
      DateModified: new Date(),
      DeliveryStatus: false,
      Progresses: [
        {
          ProgressId: 'PR002',
          ProductId: 'P002',
          UserId: 'U001',
          CustomOrderId: 'CO002',
          DateCreated: new Date().toISOString(),
          MaterialsImages: '',
          ProgressImages: '',
          FinalImages: '',
          Status: 'Pending',
          DateCompleted: new Date()
        }
      ],
      Product: {
        ProductId: 'P002',
        ProductName: 'Custom Leather Sofa',
        ProductImages: 'https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg, https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg',
        ShortDesc: 'Luxurious custom leather sofa',
        LongDesc: 'Handcrafted leather sofa with custom specifications',
        Sizes: 'Large',
        Category: 'Furniture',
        Colour: 'Tan',
        Prize: 7500,
        StockQuantity: 1,
        StockLimit: 0,
        CustomPrize: 0,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date(),
        IsActivated: false,
        IsCustommable: false
      }
    },
    {
      CustomOrderId: 'CO003',
      ProductId: 'P003',
      UserId: 'U001',
      Price: 6000,
      Discount: 600,
      Quantity: 1,
      Deposit: 1500,
      Balance: 4500,
      DateCreated: new Date().toISOString(),
      DateModified: new Date(),
      DeliveryStatus: false,
      Progresses: [
        {
          ProgressId: 'PR003',
          ProductId: 'P003',
          UserId: 'U001',
          CustomOrderId: 'CO003',
          DateCreated: new Date().toISOString(),
          MaterialsImages: 'mat1.jpg,mat2.jpg',
          ProgressImages: '',
          FinalImages: '',
          Status: 'Materials Collected',
          DateCompleted: new Date()
        }
      ],
      Product: {
        ProductId: 'P003',
        ProductName: 'Minimalist Bookshelf',
        ProductImages: 'https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg, https://i.pinimg.com/474x/33/86/f0/3386f0179e9f7f52e7759e6e296b8e13.jpg',
        ShortDesc: 'Sleek minimalist bookshelf',
        LongDesc: 'Modern minimalist bookshelf with clean lines',
        Sizes: 'Medium',
        Category: 'Furniture',
        Colour: 'White',
        Prize: 6000,
        StockQuantity: 1,
        StockLimit: 0,
        CustomPrize: 0,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 0,
        Deposit: 0,
        DateCreated: new Date(),
        IsActivated: false,
        IsCustommable: false
      }
    }
  ];

  // Selected image for gallery
  selectedImage: string = '';
  
  // Flag to show image modal
  isImageModalOpen: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  // Calculate progress percentage
  calculateProgressPercentage(progress: Progress): number {
    if (!progress) return 0;
    
    let progressSteps = 0;
    if (progress.MaterialsImages && progress.MaterialsImages.trim() !== '') progressSteps++;
    if (progress.ProgressImages && progress.ProgressImages.trim() !== '') progressSteps++;
    if (progress.FinalImages && progress.FinalImages.trim() !== '') progressSteps++;
    
    return progressSteps * 33.33;
  }

  // Open image in modal
  openImageModal(image: string): void {
    this.selectedImage = image;
    this.isImageModalOpen = true;
  }

  // Close image modal
  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedImage = '';
  }

  // Complete payment for a custom order
  completePayment(customOrder: CustomOrder): void {
    // In a real application, this would call a service to process payment
    console.log(`Completing payment for order ${customOrder.CustomOrderId}`);
    // Example of updating order status (would typically be done via a service)
    customOrder.Balance = 0;
    if (customOrder.Progresses && customOrder.Progresses.length > 0) {
      customOrder.Progresses[0].Status = 'Completed';
      customOrder.Progresses[0].DateCompleted = new Date();
    }
  }

  // Split images into array
  splitImages(imageString: string): string[] {
    return imageString ? imageString.split(',').filter(img => img.trim() !== '') : [];
  }
}
