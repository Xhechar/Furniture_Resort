import { Component, OnInit } from '@angular/core';
import { CustomOrder, Progress } from '../../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomOrderService } from '../../../services/custom-order.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationsComponent } from "../../notifications/notifications.component";

@Component({
  selector: 'app-user-progresses',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationsComponent],
  templateUrl: './user-progresses.component.html',
  styleUrl: './user-progresses.component.css'
})
export class UserProgressesComponent implements OnInit {

  customOrders: CustomOrder[] = [];

  selectedImage: string = '';
  
  isImageModalOpen: boolean = false;

  constructor(private cos: CustomOrderService, private ns: NotificationsService) { }

  ngOnInit(): void { }

  calculateProgressPercentage(progress: Progress): number {
    if (!progress) return 0;
    
    let progressSteps = 0;
    if (progress.MaterialsImages && progress.MaterialsImages.trim() !== '') progressSteps++;
    if (progress.ProgressImages && progress.ProgressImages.trim() !== '') progressSteps++;
    if (progress.FinalImages && progress.FinalImages.trim() !== '') progressSteps++;
    
    return progressSteps * 33.33;
  }

  openImageModal(image: string): void {
    this.selectedImage = image;
    this.isImageModalOpen = true;
  }

  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedImage = '';
  }

  completePayment(customOrder: CustomOrder): void {

    this.cos.updateCustomOrderStatus(customOrder.CustomOrderId).subscribe({
      next: (response) => {
        if (response.success) {
          this.ns.showMessage(response.message as string, response.success);
          this.getCustomOrders();
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    })
  }

  getCustomOrders() {
    this.cos.getCustomOrdersByUserId().subscribe({
      next: (response) => {
        if (response.success) {
          this.customOrders = response.customOrders as CustomOrder[];
        } else {
          this.ns.showMessage(response.error as string, false);
        }
      },
      error: (error) => {
        this.ns.showMessage(error.error.error as string, false);
      }
    });
  }

  splitImages(imageString: string): string[] {
    return imageString ? imageString.split(',').filter(img => img.trim() !== '') : [];
  }
}
