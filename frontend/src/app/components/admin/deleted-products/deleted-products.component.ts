import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Progress, User, Product, CustomOrder } from '../../../interfaces/interfaces';

@Component({
  selector: 'app-deleted-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deleted-products.component.html',
  styleUrl: './deleted-products.component.css'
})
export class DeletedProductsComponent implements OnInit{
  progressList: Progress[] = [];
  selectedStage: { [key: number]: string } = {};
  fullImageUrl: string | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize with dummy data
    this.loadDummyData();
    
    // Initialize all progresses to show materials stage first
    this.progressList.forEach((_, index) => {
      this.selectedStage[index] = 'materials';
    });
  }

  // Load dummy data for demonstration
  loadDummyData(): void {
    // Generate some dummy users
    const users: User[] = [
      {
        UserId: '1',
        Fullname: 'John Doe',
        Email: 'john@example.com',
        Mobile: '+254712345678',
        Country: 'Kenya',
        City: 'Nairobi',
        Gender: 'Male',
        IdentificationNumber: 12345678,
        ProfileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date(),
        HasOrder: true,
        HasWishList: false,
        Role: 'Customer',
        Selected: false
      },
      {
        UserId: '2',
        Fullname: 'Jane Smith',
        Email: 'jane@example.com',
        Mobile: '+254723456789',
        Country: 'Kenya',
        City: 'Mombasa',
        Gender: 'Female',
        IdentificationNumber: 87654321,
        ProfileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        BackgroundWallpaper: '',
        Password: '',
        IsWelcomed: true,
        IsDeleted: false,
        DateCreated: new Date(),
        HasOrder: true,
        HasWishList: true,
        Role: 'Customer',
        Selected: false
      }
    ];

    // Generate some dummy products
    const products: Product[] = [
      {
        ProductId: '1',
        ProductName: 'Custom Wooden Table',
        ProductImages: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg,https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
        ShortDesc: 'Handcrafted wooden dining table',
        LongDesc: 'Beautiful handcrafted wooden dining table made from premium hardwood.',
        Sizes: 'L,XL',
        Category: 'Furniture',
        Colour: 'Brown',
        Prize: 12000,
        StockQuantity: 5,
        StockLimit: 2,
        CustomPrize: 15000,
        OnOffer: false,
        OnFlushSale: false,
        Discount: 0,
        MakePeriods: 14,
        Deposit: 7500,
        DateCreated: new Date(),
        IsActivated: true,
        IsCustommable: true
      },
      {
        ProductId: '2',
        ProductName: 'Leather Sofa Set',
        ProductImages: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg,https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
        ShortDesc: 'Premium leather sofa set',
        LongDesc: 'Luxurious premium leather sofa set with comfortable cushions and durable frame.',
        Sizes: 'Standard',
        Category: 'Furniture',
        Colour: 'Black',
        Prize: 35000,
        StockQuantity: 2,
        StockLimit: 1,
        CustomPrize: 40000,
        OnOffer: true,
        OnFlushSale: false,
        Discount: 10,
        MakePeriods: 21,
        Deposit: 20000,
        DateCreated: new Date(),
        IsActivated: true,
        IsCustommable: true
      }
    ];

    // Generate some dummy custom orders
    const customOrders: CustomOrder[] = [
      {
        CustomOrderId: '1',
        ProductId: '1',
        UserId: '1',
        Price: 15000,
        Discount: 0,
        Quantity: 1,
        Deposit: 7500,
        Balance: 7500,
        DateCreated: '2025-02-15',
        DateModified: new Date(),
        DepMpesaCode: 'MP12345678',
        DeliveryStatus: false,
        User: users[0],
        Product: products[0]
      },
      {
        CustomOrderId: '2',
        ProductId: '2',
        UserId: '2',
        Price: 36000,
        Discount: 10,
        Quantity: 1,
        Deposit: 20000,
        Balance: 16000,
        DateCreated: '2025-02-20',
        DateModified: new Date(),
        DepMpesaCode: 'MP23456789',
        DeliveryStatus: false,
        User: users[1],
        Product: products[1]
      }
    ];

    // Generate some dummy progress entries
    this.progressList = [
      {
        ProgressId: '1',
        ProductId: '1',
        UserId: '1',
        CustomOrderId: '1',
        DateCreated: '2025-02-16',
        MaterialsImages: 'https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg,https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg',
        ProgressImages: 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg,https://images.pexels.com/photos/3637718/pexels-photo-3637718.jpeg',
        FinalImages: '',
        Status: 'In Progress',
        DateCompleted: new Date(),
        User: users[0],
        Product: products[0],
        CustomOrder: customOrders[0]
      },
      {
        ProgressId: '2',
        ProductId: '2',
        UserId: '2',
        CustomOrderId: '2',
        DateCreated: '2025-02-21',
        MaterialsImages: 'https://images.pexels.com/photos/6069544/pexels-photo-6069544.jpeg,https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg',
        ProgressImages: '',
        FinalImages: '',
        Status: 'Materials Purchased',
        DateCompleted: new Date(),
        User: users[1],
        Product: products[1],
        CustomOrder: customOrders[1]
      }
    ];
  }

  // Helper method to get CSS class for status
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'materials purchased':
        return 'status-pending';
      case 'in progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  // Get materials images as array
  getMaterialsImages(progress: Progress): string[] {
    return progress.MaterialsImages ? progress.MaterialsImages.split(',') : [];
  }

  // Get progress images as array
  getProgressImages(progress: Progress): string[] {
    return progress.ProgressImages ? progress.ProgressImages.split(',') : [];
  }

  // Get final images as array
  getFinalImages(progress: Progress): string[] {
    return progress.FinalImages ? progress.FinalImages.split(',') : [];
  }

  // Set the current stage for a progress
  selectStage(index: number, stage: string): void {
    this.selectedStage[index] = stage;
  }

  // Check if current stage is the first one (for navigation)
  isFirstStage(index: number): boolean {
    return this.selectedStage[index] === 'materials';
  }

  // Check if current stage is the last one (for navigation)
  isLastStage(index: number): boolean {
    return this.selectedStage[index] === 'final';
  }

  // Navigate between stages
  navigateStage(index: number, direction: 'prev' | 'next'): void {
    const stages = ['materials', 'progress', 'final'];
    const currentIndex = stages.indexOf(this.selectedStage[index]);
    
    if (direction === 'next' && currentIndex < stages.length - 1) {
      this.selectedStage[index] = stages[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
      this.selectedStage[index] = stages[currentIndex - 1];
    }
  }

  // Handle file upload
  onFileSelected(event: Event, progress: Progress, stage: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // In a real application, you would upload these files to a server
    // For this demo, we'll simulate adding the files as URLs
    
    // This would normally be handled by your API service
    const fileUrls: string[] = [];
    for (let i = 0; i < input.files.length; i++) {
      // In a real application, you would get URLs from your server after upload
      // For this demo, we'll use placeholder URLs
      const randomId = Math.floor(Math.random() * 1000000);
      fileUrls.push(`https://source.unsplash.com/random/300x300?sig=${randomId}`);
    }

    // Update the appropriate image field based on stage
    switch (stage) {
      case 'materials':
        const currentMaterials = this.getMaterialsImages(progress);
        progress.MaterialsImages = [...currentMaterials, ...fileUrls].join(',');
        break;
      case 'progress':
        const currentProgress = this.getProgressImages(progress);
        progress.ProgressImages = [...currentProgress, ...fileUrls].join(',');
        break;
      case 'final':
        const currentFinal = this.getFinalImages(progress);
        progress.FinalImages = [...currentFinal, ...fileUrls].join(',');
        // If final images are added, update status to completed
        progress.Status = 'Completed';
        progress.DateCompleted = new Date();
        break;
    }

    // Reset file input
    input.value = '';
  }

  // Remove an image from a progress
  removeImage(progress: Progress, stage: string, imageUrl: string): void {
    switch (stage) {
      case 'materials':
        const materialImages = this.getMaterialsImages(progress).filter(img => img !== imageUrl);
        progress.MaterialsImages = materialImages.join(',');
        break;
      case 'progress':
        const progressImages = this.getProgressImages(progress).filter(img => img !== imageUrl);
        progress.ProgressImages = progressImages.join(',');
        break;
      case 'final':
        const finalImages = this.getFinalImages(progress).filter(img => img !== imageUrl);
        progress.FinalImages = finalImages.join(',');
        // If all final images are removed, revert status if it was completed
        if (finalImages.length === 0 && progress.Status === 'Completed') {
          progress.Status = 'In Progress';
        }
        break;
    }
  }

  // Show full size image in modal
  showFullImage(imageUrl: string | undefined): void {
    if (imageUrl) {
      this.fullImageUrl = imageUrl;
    }
  }

  // Close full image modal
  closeFullImage(): void {
    this.fullImageUrl = null;
  }

  // Update progress
  updateProgress(progress: Progress): void {
    // Here you would update the progress via an API call
    console.log('Updating progress:', progress);
    // Show a notification to indicate the update was successful
    alert('Progress updated successfully');
  }

  // Message user
  messageUser(user: User | undefined): void {
    if (!user) return;
    // Here you would implement messaging functionality
    console.log('Messaging user:', user);
    // For demo purposes, just show an alert
    alert(`Sending message to ${user.Fullname}`);
  }

  // Delete progress
  deleteProgress(progress: Progress): void {
    // Display a confirmation dialog
    if (confirm('Are you sure you want to delete this progress record?')) {
      // In a real application, you would call your API service to delete the record
      // For this demo, we'll just remove it from the local array
      this.progressList = this.progressList.filter(p => p.ProgressId !== progress.ProgressId);
      
      // Show a notification
      alert('Progress record deleted successfully');
    }
  }

  // Method to add a new progress record (would be connected to a form in real app)
  addNewProgress(customOrder: CustomOrder): void {
    // Create a new progress record
    const newProgress: Progress = {
      ProgressId: 'new-' + Date.now(), // In real app, this would be generated by the backend
      ProductId: customOrder.ProductId,
      UserId: customOrder.UserId,
      CustomOrderId: customOrder.CustomOrderId,
      DateCreated: new Date().toISOString().split('T')[0],
      MaterialsImages: '',
      ProgressImages: '',
      FinalImages: '',
      Status: 'Pending',
      DateCompleted: new Date(),
      User: customOrder.User,
      Product: customOrder.Product,
      CustomOrder: customOrder
    };
    
    // Add to the progress list
    this.progressList.unshift(newProgress);
    
    // Initialize the selected stage for this new entry
    this.selectedStage[0] = 'materials';
    
    // Re-index all stages after insertion
    this.progressList.forEach((_, index) => {
      this.selectedStage[index] = this.selectedStage[index] || 'materials';
    });
    
    // Show notification
    alert('New progress tracking started for ' + customOrder.Product?.ProductName);
  }

  // Update order status based on progress
  updateOrderStatus(progress: Progress): void {
    // Update order status based on progress stages
    if (progress.FinalImages && progress.FinalImages.length > 0) {
      progress.Status = 'Completed';
      progress.DateCompleted = new Date();
      
      // In a real app, you might also update the custom order's delivery status
      if (progress.CustomOrder) {
        progress.CustomOrder.DeliveryStatus = true;
      }
    } else if (progress.ProgressImages && progress.ProgressImages.length > 0) {
      progress.Status = 'In Progress';
    } else if (progress.MaterialsImages && progress.MaterialsImages.length > 0) {
      progress.Status = 'Materials Purchased';
    } else {
      progress.Status = 'Pending';
    }
  }

  // Export progress report (placeholder function)
  exportProgressReport(progress: Progress): void {
    // In a real app, this would generate a PDF or other report format
    console.log('Exporting progress report for:', progress);
    alert('Progress report exported successfully');
  }

  // Send notification to customer about progress update
  notifyCustomer(progress: Progress): void {
    if (!progress.User) return;
    
    // In a real app, this would trigger an email or SMS notification
    console.log('Notifying customer:', progress.User.Fullname, 'about progress update');
    alert(`Notification sent to ${progress.User.Fullname} about the latest progress update`);
  }

  // Calculate estimated completion date
  getEstimatedCompletionDate(progress: Progress): string {
    if (!progress.Product || !progress.DateCreated) return 'Unknown';
    
    // Calculate based on make periods defined for the product
    const startDate = new Date(progress.DateCreated);
    const makePeriods = progress.Product.MakePeriods || 14; // Default to 14 days if not specified
    
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(startDate.getDate() + makePeriods);
    
    return estimatedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Calculate progress percentage
  calculateProgressPercentage(progress: Progress): number {
    // Simple algorithm based on stages completed
    let percentage = 0;
    
    if (progress.MaterialsImages && progress.MaterialsImages.length > 0) {
      percentage += 33;
    }
    
    if (progress.ProgressImages && progress.ProgressImages.length > 0) {
      percentage += 33;
    }
    
    if (progress.FinalImages && progress.FinalImages.length > 0) {
      percentage += 34;
    }
    
    return percentage;
  }
}
