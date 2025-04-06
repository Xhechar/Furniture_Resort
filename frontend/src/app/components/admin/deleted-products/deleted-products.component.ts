import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Progress, User, Product, CustomOrder } from '../../../interfaces/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deleted-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './deleted-products.component.html',
  styleUrl: './deleted-products.component.css'
})
export class DeletedProductsComponent implements OnInit, OnDestroy {
  // Core data
  progressList: Progress[] = [];
  filteredProgressList: Progress[] = [];
  
  // UI state
  selectedStage: { [key: number]: string } = {};
  fullImageUrl: string | null = null;
  isDeleteModalOpen: boolean = false;
  progressToDelete: Progress | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  // Filter options
  searchQuery: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  sortBy: string = 'newest';

  // Statistics
  totalProjects: number = 0;
  completedProjects: number = 0;
  inProgressProjects: number = 0;
  pendingProjects: number = 0;
  totalRevenue: number = 0;
  averageCompletionTime: number = 0;
  
  // Animation states
  isCardExpanded: { [key: string]: boolean } = {};

  // Subscriptions
  private subscriptions: Subscription = new Subscription();

  constructor(
    // private progressService: ProgressService,
    // private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadProgressData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // Load data from service
  loadProgressData(): void {
    this.loading = true;
    
    /* 
    // This would be the actual implementation with your service
    this.subscriptions.add(
      this.progressService.getAllProgress().subscribe({
        next: (data: Progress[]) => {
          this.progressList = data;
          this.filteredProgressList = [...this.progressList];
          this.initializeProgressCards();
          this.calculateStatistics();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching progress data:', err);
          this.error = 'Failed to load progress data. Please try again later.';
          this.loading = false;
        }
      })
    );
    */
    
    // Placeholder to keep the structure intact until you replace with your service
    this.loadDummyData();
    this.filteredProgressList = [...this.progressList];
    this.initializeProgressCards();
    this.calculateStatistics();
    this.loading = false;
  }
  
  // Initialize UI state for all progress cards
  initializeProgressCards(): void {
    // Initialize selected stage for each progress item
    this.progressList.forEach((progress, index) => {
      this.selectedStage[index] = 'materials';
      this.isCardExpanded[progress.ProgressId] = false;
    });
  }
  
  // Calculate dashboard statistics
  calculateStatistics(): void {
    this.totalProjects = this.progressList.length;
    
    this.completedProjects = this.progressList.filter(p => 
      p.Status.toLowerCase() === 'completed').length;
      
    this.inProgressProjects = this.progressList.filter(p => 
      p.Status.toLowerCase() === 'in progress').length;
      
    this.pendingProjects = this.progressList.filter(p => 
      p.Status.toLowerCase() === 'pending' || 
      p.Status.toLowerCase() === 'materials purchased').length;
    
    // Calculate total revenue
    this.totalRevenue = this.progressList.reduce((sum, progress) => {
      return sum + (progress.CustomOrder?.Price || 0);
    }, 0);
    
    // Calculate average completion time (in days)
    const completedItems = this.progressList.filter(p => p.Status.toLowerCase() === 'completed');
    if (completedItems.length > 0) {
      const totalDays = completedItems.reduce((sum, progress) => {
        const startDate = new Date(progress.DateCreated);
        const endDate = new Date(progress.DateCompleted);
        const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      this.averageCompletionTime = totalDays / completedItems.length;
    }
  }

  // Apply filters to progress list
  applyFilters(): void {
    this.filteredProgressList = this.progressList.filter(progress => {
      // Apply search query filter
      const searchMatches = !this.searchQuery || 
        progress.Product?.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        progress.User?.Fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        progress.Status.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // Apply status filter
      const statusMatches = this.statusFilter === 'all' || 
        progress.Status.toLowerCase() === this.statusFilter.toLowerCase();
      
      // Apply date filter
      let dateMatches = true;
      const createdDate = new Date(progress.DateCreated);
      const today = new Date();
      
      if (this.dateFilter === 'today') {
        dateMatches = createdDate.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'week') {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        dateMatches = createdDate >= lastWeek;
      } else if (this.dateFilter === 'month') {
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        dateMatches = createdDate >= lastMonth;
      }
      
      return searchMatches && statusMatches && dateMatches;
    });
    
    // Apply sorting
    this.sortProgressList();
  }
  
  // Sort the filtered progress list
  sortProgressList(): void {
    this.filteredProgressList.sort((a, b) => {
      switch (this.sortBy) {
        case 'newest':
          return new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime();
        case 'oldest':
          return new Date(a.DateCreated).getTime() - new Date(b.DateCreated).getTime();
        case 'name-asc':
          return (a.Product?.ProductName || '').localeCompare(b.Product?.ProductName || '');
        case 'name-desc':
          return (b.Product?.ProductName || '').localeCompare(a.Product?.ProductName || '');
        case 'price-high':
          return (b.CustomOrder?.Price || 0) - (a.CustomOrder?.Price || 0);
        case 'price-low':
          return (a.CustomOrder?.Price || 0) - (b.CustomOrder?.Price || 0);
        default:
          return 0;
      }
    });
  }

  // Reset all filters
  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.sortBy = 'newest';
    this.filteredProgressList = [...this.progressList];
  }
  
  // Toggle card expanded state for animations
  toggleCardExpansion(progressId: string): void {
    this.isCardExpanded[progressId] = !this.isCardExpanded[progressId];
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

    /* In a real application, you would upload these files to a server
    this.progressService.uploadImages(progress.ProgressId, stage, input.files).subscribe({
      next: (response) => {
        // Update the progress with new image URLs from the response
        this.updateImagesAfterUpload(progress, stage, response.imageUrls);
        this.notificationService.success('Images uploaded successfully');
      },
      error: (err) => {
        console.error('Error uploading images:', err);
        this.notificationService.error('Failed to upload images');
      }
    });
    */

    // For demo: simulate adding the files as URLs
    const fileUrls: string[] = [];
    for (let i = 0; i < input.files.length; i++) {
      const randomId = Math.floor(Math.random() * 1000000);
      fileUrls.push(`https://source.unsplash.com/random/300x300?sig=${randomId}`);
    }

    // Update the appropriate image field based on stage
    this.updateImagesAfterUpload(progress, stage, fileUrls);
    
    // Reset file input
    input.value = '';
  }
  
  // Update images after successful upload
  updateImagesAfterUpload(progress: Progress, stage: string, imageUrls: string[]): void {
    switch (stage) {
      case 'materials':
        const currentMaterials = this.getMaterialsImages(progress);
        progress.MaterialsImages = [...currentMaterials, ...imageUrls].join(',');
        if (progress.Status === 'Pending') {
          progress.Status = 'Materials Purchased';
        }
        break;
      case 'progress':
        const currentProgress = this.getProgressImages(progress);
        progress.ProgressImages = [...currentProgress, ...imageUrls].join(',');
        if (progress.Status === 'Materials Purchased' || progress.Status === 'Pending') {
          progress.Status = 'In Progress';
        }
        break;
      case 'final':
        const currentFinal = this.getFinalImages(progress);
        progress.FinalImages = [...currentFinal, ...imageUrls].join(',');
        progress.Status = 'Completed';
        progress.DateCompleted = new Date();
        break;
    }
    
    // Update statistics after changing status
    this.calculateStatistics();
    
    /* In a real application, update the progress record
    this.progressService.updateProgress(progress).subscribe({
      next: () => {
        this.notificationService.success('Progress updated successfully');
      },
      error: (err) => {
        console.error('Error updating progress:', err);
        this.notificationService.error('Failed to update progress');
      }
    });
    */
  }

  // Remove an image from a progress
  removeImage(progress: Progress, stage: string, imageUrl: string): void {
    /* In a real application, call the service to remove the image
    this.progressService.removeImage(progress.ProgressId, stage, imageUrl).subscribe({
      next: () => {
        this.updateAfterImageRemoval(progress, stage, imageUrl);
        this.notificationService.success('Image removed successfully');
      },
      error: (err) => {
        console.error('Error removing image:', err);
        this.notificationService.error('Failed to remove image');
      }
    });
    */
    
    // For demo, just update locally
    this.updateAfterImageRemoval(progress, stage, imageUrl);
  }
  
  // Update progress after image removal
  updateAfterImageRemoval(progress: Progress, stage: string, imageUrl: string): void {
    switch (stage) {
      case 'materials':
        const materialImages = this.getMaterialsImages(progress).filter(img => img !== imageUrl);
        progress.MaterialsImages = materialImages.join(',');
        // Update status if no materials images are left
        if (materialImages.length === 0 && progress.Status === 'Materials Purchased') {
          progress.Status = 'Pending';
        }
        break;
      case 'progress':
        const progressImages = this.getProgressImages(progress).filter(img => img !== imageUrl);
        progress.ProgressImages = progressImages.join(',');
        // Update status if no progress images are left
        if (progressImages.length === 0 && progress.Status === 'In Progress' && this.getMaterialsImages(progress).length > 0) {
          progress.Status = 'Materials Purchased';
        }
        break;
      case 'final':
        const finalImages = this.getFinalImages(progress).filter(img => img !== imageUrl);
        progress.FinalImages = finalImages.join(',');
        // Update status if no final images are left
        if (finalImages.length === 0 && progress.Status === 'Completed') {
          progress.Status = 'In Progress';
        }
        break;
    }
    
    // Update statistics after changing status
    this.calculateStatistics();
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

  // Open delete confirmation modal
  openDeleteModal(progress: Progress): void {
    this.progressToDelete = progress;
    this.isDeleteModalOpen = true;
  }

  // Close delete confirmation modal
  closeDeleteModal(): void {
    this.progressToDelete = null;
    this.isDeleteModalOpen = false;
  }

  // Update progress
  updateProgress(progress: Progress): void {
    /* In a real application, call the service to update progress
    this.progressService.updateProgress(progress).subscribe({
      next: () => {
        this.notificationService.success('Progress updated successfully');
      },
      error: (err) => {
        console.error('Error updating progress:', err);
        this.notificationService.error('Failed to update progress');
      }
    });
    */
    
    // For demo, just log and show alert
    console.log('Updating progress:', progress);
    alert('Progress updated successfully');
  }

  // Message user
  messageUser(user: User | undefined): void {
    if (!user) return;
    
    /* In a real application, navigate to messaging component or open a modal
    this.router.navigate(['/messages'], { queryParams: { userId: user.UserId } });
    */
    
    // For demo, just log and show alert
    console.log('Messaging user:', user);
    alert(`Sending message to ${user.Fullname}`);
  }

  // Delete progress
  deleteProgress(): void {
    if (!this.progressToDelete) return;
    
    /* In a real application, call the service to delete progress
    this.progressService.deleteProgress(this.progressToDelete.ProgressId).subscribe({
      next: () => {
        this.progressList = this.progressList.filter(p => p.ProgressId !== this.progressToDelete!.ProgressId);
        this.filteredProgressList = this.filteredProgressList.filter(p => p.ProgressId !== this.progressToDelete!.ProgressId);
        this.calculateStatistics();
        this.notificationService.success('Progress record deleted successfully');
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Error deleting progress:', err);
        this.notificationService.error('Failed to delete progress record');
        this.closeDeleteModal();
      }
    });
    */
    
    // For demo, just remove from local array
    this.progressList = this.progressList.filter(p => p.ProgressId !== this.progressToDelete!.ProgressId);
    this.filteredProgressList = this.filteredProgressList.filter(p => p.ProgressId !== this.progressToDelete!.ProgressId);
    this.calculateStatistics();
    alert('Progress record deleted successfully');
    this.closeDeleteModal();
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

  // Get estimated completion date
  getEstimatedCompletionDate(progress: Progress): string {
    if (!progress.Product || !progress.DateCreated) return 'Unknown';
    
    const startDate = new Date(progress.DateCreated);
    const makePeriods = progress.Product.MakePeriods || 14;
    
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(startDate.getDate() + makePeriods);
    
    return estimatedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  // Get days remaining until estimated completion
  getDaysRemaining(progress: Progress): number {
    if (!progress.Product || !progress.DateCreated) return 0;
    
    const startDate = new Date(progress.DateCreated);
    const makePeriods = progress.Product.MakePeriods || 14;
    const estimatedDate = new Date(startDate);
    estimatedDate.setDate(startDate.getDate() + makePeriods);
    
    const today = new Date();
    const remainingTime = estimatedDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    
    return remainingDays > 0 ? remainingDays : 0;
  }

  // Check if progress is overdue
  isOverdue(progress: Progress): boolean {
    if (progress.Status === 'Completed') return false;
    return this.getDaysRemaining(progress) === 0;
  }

  // Export progress report (placeholder function)
  exportProgressReport(progress: Progress): void {
    console.log('Exporting progress report for:', progress);
    alert('Progress report exported successfully');
  }

  // Send notification to customer about progress update
  notifyCustomer(progress: Progress): void {
    if (!progress.User) return;
    
    /* In a real application, call service to send notification
    this.notificationService.sendCustomerUpdate(progress.UserId, progress.ProgressId).subscribe({
      next: () => {
        alert(`Notification sent to ${progress.User!.Fullname} about the latest progress update`);
      },
      error: (err) => {
        console.error('Error sending notification:', err);
        alert('Failed to send notification');
      }
    });
    */
    
    // For demo, just log and show alert
    console.log('Notifying customer:', progress.User.Fullname);
    alert(`Notification sent to ${progress.User.Fullname} about the latest progress update`);
  }
  
  // KEEPING THE ORIGINAL DUMMY DATA LOADER AS REQUESTED
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
        ProfileImage: 'httpsr://randomuser.me/api/portraits/men/32.jpg',
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
        ProfileImage: 'httpsg://randomuser.me/api/portraits/women/44.jpg',
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
        DeliveryStatus: 'pending',
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
        DeliveryStatus: 'pending',
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
}