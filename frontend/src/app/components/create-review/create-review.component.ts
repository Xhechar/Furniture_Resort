import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Review } from '../../interfaces/interfaces';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css'
})
export class CreateReviewComponent {

  createReview(review: Review) {
    console.log(review);
  }
}
