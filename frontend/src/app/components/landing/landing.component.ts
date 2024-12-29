import { Component } from '@angular/core';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [TopbarComponent, CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  products = [
    {
      image: "../../../furniture_images/chair-removebg-preview.png",
      product_name: "GREY SOURES DINING",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 45000,
      rating: 4.0
    },
    {
      image: "../../../furniture_images/comfy_chzir-removebg-preview.png",
      product_name: "COMFY CHZIR CHAIR",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 15780,
      rating: 3.0,
    },
    {
      image: "../../../furniture_images/sofa-removebg-preview.png",
      product_name: "COTTON WHITE SOFA",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 60000,
      rating: 5.0,
    },
    {
      image: "../../../furniture_images/sofas-removebg-preview.png",
      product_name: "GREY TRENDY COUCH",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 30260,
      rating: 4.0,
    },
    {
      image: "../../../furniture_images/0f7cdfa7e031e7d2ec50348ac09412eb-removebg-preview.png",
      product_name: "BROWN COUPLE BED",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 50000,
      rating: 5.0,
    },
    {
      image: "../../../furniture_images/09f08cd83ce7e1e127a455a3ed242cd0-removebg-preview.png",
      product_name: "GREY SOURES DINING",
      short_description: "Grey well furnished Family table for four, well furnished and decorated.",
      price: 25000,
      rating: 3.0,
    }
  ];

  categories: string[] = ["Beds", "Sofas", "Dinings", "Tables", "Furnishings", "Lightings", "TV Stands"];
}
