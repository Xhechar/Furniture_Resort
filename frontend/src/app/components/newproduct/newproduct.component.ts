import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProductsService } from '../../services/products.service';
import { NotificationsService } from '../../services/notifications.service';
import { Observable, of } from 'rxjs';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-newproduct',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NotificationsComponent],
  templateUrl: './newproduct.component.html',
  styleUrl: './newproduct.component.css'
})
export class NewproductComponent {
  picked_color = '';
  _color = {
    'background': '#fff'
  }
  furniture_images: string[] = [];
  set_loader: number = 0;
  category_options: string[] = ['Dining', 'Bed', 'Chair', 'Table']

  newProductForm!: FormGroup;

  constructor(private fb: FormBuilder, private ps: ProductsService, private ns: NotificationsService, private cs: CategoryService) {
    this.newProductForm = fb.group({
      ProductImages: ['', [Validators.required]],
      Prize: ['', [Validators.required, this.validateSring()]],
      Discount: ['', [Validators.required, this.validateSring()]],
      Deposit: ['', [Validators.required, this.validateSring()]],
      CustomPrize: ['', [Validators.required, this.validateSring()]],
      Colour: ['', [Validators.required, this.validateSring()]],
      Sizes: ['', [Validators.required, this.validateSring()]],
      ProductName: ['', [Validators.required, this.validateSring()]],
      Category: ['', [Validators.required], this.validateSring()],
      StockQuantity: ['', [Validators.required]],
      StockLimit: ['', [Validators.required]],
      MakePeriods: ['', [Validators.required]],
      ShortDesc: ['', [Validators.required, this.validateShortDesc()]],
      LongDesc: ['', [Validators.required, this.validateLongDesc()]]
    });

    this.cs.getAllCategories().subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res.categories);
        } else {
          this.ns.showMessage(res.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
  }

  createNewProduct() {
    this.newProductForm.patchValue({ ProductImages: this.returnString(this.furniture_images) });
    this.newProductForm.patchValue({ Colour: this.picked_color});
    
    this.ps.createProduct(this.newProductForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.ns.showMessage('Product created successfully', true);
          this.clearImages(this.furniture_images);
        } else {
          this.ns.showMessage(res.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
    this.newProductForm.reset();
  }

  returnString(names: string[]): string {
    let urls: string = '';
    names.forEach(name => {
      urls += name + ', ';
    });
    return urls.slice(0, -2);
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

  setColorBg(event: any) {
    this.picked_color = '';
    this._color['background'] = '#fff';
    let color = event.target.value;

    fetch(`https://www.thecolorapi.com/id?hex=${color.replace("#", "")}`).then(res => res.json()).then((res) => {
      this.picked_color = res.name.value;
      this._color['background'] = color as string;
    });
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
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      let value: string = control.value;

      if (!value) {
        return of({required: true})
      } else {
        if (value.length <= 2) {
          return of({ 'invalidStringLength': true });
        } else {
          let pattern = /^[a-zA-Z0-9 ]*$/;
          if (!pattern.test(value)) {
            return of({ 'invalidString': true })
          } else {
            return of(null)
          }
        }
      }
    }
  }

  validateShortDesc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value: string = control.value;
      
      if (!value) {
        return {required: true}
      } else {
        if (value.length <= 20) {
          return null;
        } else {
          return { 'invalidShortDescLength': true };
        }
      }
    }
  }

  validateLongDesc(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let value: string = control.value;
      
      if (!value) {
        return {required: true}
      } else {
        if (value.length <= 200) {
          return null;
        } else {
          return { 'invalidLongDescLength': true };
        }
      }
    }
  }


}