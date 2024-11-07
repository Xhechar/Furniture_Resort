import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-newproduct',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './newproduct.component.html',
  styleUrl: './newproduct.component.css'
})
export class NewproductComponent {
  furniture_images: string[] = [];
  set_loader: number = 0;
  category_options: string[] = ['Dining', 'Bed', 'Chair', 'Table']

  newProductForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.newProductForm = fb.group({
      images: ['', [Validators.required]],
      price: ['', [Validators.required, this.validateSring()]],
      color: ['', [Validators.required, this.validateSring()]],
      size: ['', [Validators.required, this.validateSring()]],
      furniture_name: ['', [Validators.required, this.validateSring()]],
      category: ['', [Validators.required]],
      short_description: ['', [Validators.required]],
      long_description: ['', [Validators.required]]
    });
  }

  createNewProduct() {
    this.newProductForm.setValue({images: this.furniture_images})
    if (this.newProductForm.valid) {
      console.log(this.newProductForm.value);
      this.clearImages(this.furniture_images);
    } else {
      console.error('Form is invalid');
    }
  }

  removeImage(index: number): void {
    URL.revokeObjectURL(this.furniture_images[index]);
    this.furniture_images.splice(index, 1);
  }

  clearImages(images: string[]) {
    for (let image of images) {
      URL.revokeObjectURL(image);
    }
  }

  setFurnitureImages(event: any) {
    const file = event.target.files[0];

    this.set_loader = 1;

    let formData = new FormData();
    formData.append('image_file', file);

    fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'wzPTCfm92DB8SAfV6NDYA6sF'
      },
      body: formData
    }).then(res => res.blob()).then(res => {
      let image: string = URL.createObjectURL(res);
      this.furniture_images.push(image);
      this.set_loader = 0;
    });

    event.target.value = '';
  }

  validateSring(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value: string = control.value;

      if (!value) {
        return null
      } else {
        if (value.length <= 2) {
          return { 'invalidStringLength': true };
        } else {
          let pattern = /^[a-zA-Z0-9 ]*$/;
          if (!pattern.test(value)) {
            return { 'invalidString': true }
          } else {
            return null
          }
        }
      }
    }
  }

}