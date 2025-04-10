import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Progress, User, Product, CustomOrder, ProductQuantityTime } from '../../../interfaces/interfaces';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ProgressService } from '../../../services/progress.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Router } from '@angular/router';

type Stage = 'materials' | 'progress' | 'final';

@Component({
  selector: 'app-deleted-products',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './deleted-products.component.html',
  styleUrl: './deleted-products.component.css'
})
export class DeletedProductsComponent implements OnInit {
  progressList: Progress[] = [];
  filteredProgressList: Progress[] = [];

  selectedStage: { [key: number]: string } = {};
  fullImageUrl: string | null = null;
  isDeleteModalOpen: boolean = false;
  progressToDelete: Progress | null = null;
  loading: boolean = true;
  error: string | null = null;

  searchQuery: string = '';
  statusFilter: string = 'all';
  dateFilter: string = 'all';
  sortBy: string = 'newest';

  totalProjects: number = 0;
  completedProjects: number = 0;
  inProgressProjects: number = 0;
  pendingProjects: number = 0;
  totalRevenue: number = 0;

  private uploadedImages: { [key: string]: { materials: string[], progress: string[], final: string[] } } = {};

  private isUpdating: boolean = false;

  constructor(
    private progressService: ProgressService,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProgressData();
  }

  loadProgressData(): void {
    this.loading = true;
    this.progressService.getAllProgresses().subscribe({
      next: (response) => {
        if (response.success) {
          this.progressList = response.progresses as Progress[];
          this.filteredProgressList = [...this.progressList];
          this.initializeProgressCards();
          this.calculateStatistics();
          this.loading = false;
        } else {
          this.notificationService.showMessage(response.error as string, false);
          this.loading = false;
        }
      },
      error: (error) => {
        this.notificationService.showMessage(error.error?.error || 'Failed to load progress data', false);
        this.loading = false;
      }
    });
  }

  initializeProgressCards(): void {
    this.progressList.forEach((progress, index) => {
      this.selectedStage[index] = 'materials';
      this.uploadedImages[progress.ProgressId] = {
        materials: progress.MaterialsImages ? progress.MaterialsImages.split(',') : [],
        progress: progress.ProgressImages ? progress.ProgressImages.split(',') : [],
        final: progress.FinalImages ? progress.FinalImages.split(',') : []
      };
    });
  }

  calculateStatistics(): void {
    this.totalProjects = this.progressList.length;
    this.completedProjects = this.progressList.filter(p => p.Status.toLowerCase() === 'completed').length;
    this.inProgressProjects = this.progressList.filter(p => p.Status.toLowerCase() === 'in progress').length;
    this.pendingProjects = this.progressList.filter(p => 
      p.Status.toLowerCase() === 'pending' || p.Status.toLowerCase() === 'materials purchased').length;
    this.totalRevenue = this.progressList.reduce((sum, progress) => {
      return sum + (progress.CustomOrder?.Price || 0);
    }, 0);
  }

  applyFilters(): void {
    this.filteredProgressList = this.progressList.filter(progress => {
      const searchMatches = !this.searchQuery || 
        progress.Product?.ProductName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        progress.User?.Fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        progress.Status.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const statusMatches = this.statusFilter === 'all' || 
        progress.Status.toLowerCase() === this.statusFilter.toLowerCase();
      
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

    this.sortProgressList();
  }

  /** Sorts the filtered progress list */
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

  /** Resets all filters to default values */
  resetFilters(): void {
    this.searchQuery = '';
    this.statusFilter = 'all';
    this.dateFilter = 'all';
    this.sortBy = 'newest';
    this.filteredProgressList = [...this.progressList];
  }

  /** Returns CSS class based on progress status */
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

  /** Formats a date string to a readable format */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /** Gets images for each stage */
  getMaterialsImages(progress: Progress): string[] {
    return this.uploadedImages[progress.ProgressId]?.materials || [];
  }

  getProgressImages(progress: Progress): string[] {
    return this.uploadedImages[progress.ProgressId]?.progress || [];
  }

  getFinalImages(progress: Progress): string[] {
    return this.uploadedImages[progress.ProgressId]?.final || [];
  }

  selectStage(index: number, stage: string): void {
    this.selectedStage[index] = stage;
  }

  isFirstStage(index: number): boolean {
    return this.selectedStage[index] === 'materials';
  }

  isLastStage(index: number): boolean {
    return this.selectedStage[index] === 'final';
  }

  navigateStage(index: number, direction: 'prev' | 'next'): void {
    const stages = ['materials', 'progress', 'final'];
    const currentIndex = stages.indexOf(this.selectedStage[index]);
    if (direction === 'next' && currentIndex < stages.length - 1) {
      this.selectedStage[index] = stages[currentIndex + 1];
    } else if (direction === 'prev' && currentIndex > 0) {
      this.selectedStage[index] = stages[currentIndex - 1];
    }
  }

  onFileSelected(event: any, progress: Progress, stage: Stage): void {
    const input = event.target;
    if (!input.files || input.files.length === 0) {
      this.notificationService.showMessage('No images selected', false);
      return;
    }
  
    if (!this.uploadedImages[progress.ProgressId]) {
      this.uploadedImages[progress.ProgressId] = { materials: [], progress: [], final: [] };
    }
  
    const files = Array.from(input.files);
    files.forEach(file => {
      const formData = new FormData();
      formData.append('file', file as Blob);
      formData.append('cloud_name', 'dakyiye2e');
      formData.append('upload_preset', 'furniture-site-images');
  
      fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
        method: 'POST',
        body: formData
      })
        .then(res => res.json())
        .then(res => {
          if (res.secure_url) {
            this.uploadedImages[progress.ProgressId][stage].push(res.secure_url);
            this.notificationService.showMessage('Image uploaded successfully', true);
          }
        })
        .catch(error => {
          this.notificationService.showMessage('Failed to upload image: ' + error.message, false);
        });
    });
  }

  updateProgress(progress: Progress): void {
    if (this.isUpdating) {
      this.notificationService.showMessage('Only one progress can be updated at a time', false);
      return;
    }

    this.isUpdating = true;
    const updatedProgress: Progress = {
      ...progress,
      MaterialsImages: this.uploadedImages[progress.ProgressId]?.materials.join(',') || '',
      ProgressImages: this.uploadedImages[progress.ProgressId]?.progress.join(',') || '',
      FinalImages: this.uploadedImages[progress.ProgressId]?.final.join(',') || ''
    };

    this.progressService.updateProgress(progress.ProgressId, updatedProgress).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.showMessage(response.message as string, true);
          const index = this.progressList.findIndex(p => p.ProgressId === progress.ProgressId);
          if (index !== -1) {
            this.progressList[index] = updatedProgress;
            this.filteredProgressList = [...this.progressList];
          }
          this.loadProgressData();
          this.isUpdating = false;
        } else {
          this.notificationService.showMessage(response.error as string, false);
          this.isUpdating = false;
        }
      },
      error: (err) => {
        this.notificationService.showMessage(err.error.error as string, false);
        this.isUpdating = false;
      }
    });
  }

  removeImage(progress: Progress, stage: Stage, imageUrl: string): void {
    if (this.uploadedImages[progress.ProgressId] && this.uploadedImages[progress.ProgressId][stage]) {
      this.uploadedImages[progress.ProgressId][stage] = 
        this.uploadedImages[progress.ProgressId][stage].filter(img => img !== imageUrl);
      this.notificationService.showMessage('Image removed successfully', true);
    }
  }

  /** Shows a full-size image in a modal */
  showFullImage(imageUrl: string | undefined): void {
    if (imageUrl) {
      this.fullImageUrl = imageUrl;
    }
  }

  /** Closes the full-size image modal */
  closeFullImage(): void {
    this.fullImageUrl = null;
  }

  /** Opens the delete confirmation modal */
  openDeleteModal(progress: Progress): void {
    this.progressToDelete = progress;
    this.isDeleteModalOpen = true;
  }

  /** Closes the delete confirmation modal */
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.progressToDelete = null;
  }

  /** Deletes a progress item */
  deleteProgress(): void {
    if (!this.progressToDelete) return;

    this.progressService.deleteProgress(this.progressToDelete.ProgressId).subscribe({
      next: () => {
        this.notificationService.showMessage('Progress deleted successfully', true);
        this.progressList = this.progressList.filter(p => p.ProgressId !== this.progressToDelete!.ProgressId);
        this.filteredProgressList = [...this.progressList];
        this.closeDeleteModal();
      },
      error: (err) => {
        this.notificationService.showMessage('Failed to delete progress: ' + err.message, false);
        this.closeDeleteModal();
      }
    });
  }

  calculateProgressPercentage(progress: Progress): number {
    const stages = [
      progress.MaterialsImages ? 1 : 0,
      progress.ProgressImages ? 1 : 0,
      progress.FinalImages ? 1 : 0
    ];
    const completed = stages.reduce((sum, stage) => sum + stage, 0);
    return Math.round((completed / 3) * 100);
  }

  getEstimatedCompletionDate(progress: Progress): string {
    const createdDate = new Date(progress.DateCreated);
    let pqt: ProductQuantityTime[] = progress.Product?.ProductQuantityTimes || [];
    let productCount = progress.CustomOrder?.Quantity || 0;
    const estimatedDays = pqt.filter(p => p.Period >= productCount)[0].Period || 0;
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(createdDate.getDate() + estimatedDays);
    return estimatedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  getDaysRemaining(progress: Progress): number {
    const today = new Date();
    const estimatedDate = new Date(this.getEstimatedCompletionDate(progress));
    const diffTime = estimatedDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isOverdue(progress: Progress): boolean {
    return this.getDaysRemaining(progress) < 0 && progress.Status.toLowerCase() !== 'completed';
  }

  exportProgressReport(progress: Progress): void {
    this.notificationService.showMessage('Exporting progress report', true);
  }

  notifyCustomer(progress: Progress): void {
    this.notificationService.showMessage('Customer notified successfully', true);
  }

  messageUser(user: User | undefined): void {
    if (user) {
      this.notificationService.showMessage(`Messaging ${user.Fullname} ... `, true);
      setTimeout(() => {
        this.router.navigate(['/chat', user.UserId]);
      }, 3000);
    }
  }
}