import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ProductsService } from '../../services/products.service';
import { NotificationsService } from '../../services/notifications.service';
import { Observable, of } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { Category, Product } from '../../interfaces/interfaces';
import { ModalService } from '../../services/modal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-newproduct',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NotificationsComponent, RouterLink],
  templateUrl: './newproduct.component.html',
  styleUrl: './newproduct.component.css'
})
export class NewproductComponent implements OnInit {
  inUpdate: boolean = false;
  productData!: Product;
  productId: string = '';

  picked_color = '';
  _color = {
    'background': '#fff'
  }
  furniture_images: string[] = [];
  set_loader: number = 0;
  category_options!: Category[];

  newProductForm!: FormGroup;

  constructor(private fb: FormBuilder, private ps: ProductsService, private ns: NotificationsService, private cs: CategoryService, private ms: ModalService) {
    this.newProductForm = fb.group({
      ProductImages: [this.productData?.ProductImages || '', [Validators.required]],
      Prize: [this.productData?.Prize || '', [Validators.required, this.validateSring()]],
      Discount: [this.productData?.Discount || '', [Validators.required, this.validateSring()]],
      Deposit: [this.productData?.Deposit || '', [Validators.required, this.validateSring()]],
      CustomPrize: [this.productData?.CustomPrize || '', [Validators.required, this.validateSring()]],
      Colour: [this.productData?.Colour || '', [Validators.required, this.validateSring()]],
      Sizes: [this.productData?.Sizes || '', [Validators.required, this.validateSring()]],
      ProductName: [this.productData?.ProductName || '', [Validators.required, this.validateSring()]],
      Category: [this.productData?.Category || '', [Validators.required, this.validateSring()]],
      StockQuantity: [this.productData?.StockQuantity || '', [Validators.required]],
      StockLimit: [this.productData?.StockLimit || '', [Validators.required]],
      MakePeriods: [this.productData?.MakePeriods || '', [Validators.required]],
      ShortDesc: [this.productData?.ShortDesc || '', [Validators.required, this.validateShortDesc()]],
      LongDesc: [this.productData?.LongDesc || '', [Validators.required, this.validateLongDesc()]]
    });

    this.cs.getAllCategories().subscribe({
      next: (res) => {
        if (res.success) {
          this.category_options = res.categories as Category[];
        } else {
          this.ns.showMessage(res.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });
  }

  ngOnInit(): void {
    this.ms.inUpdate$.subscribe(res => {
      this.inUpdate = res
    });
    this.ms.productData$.subscribe(res => {
      this.productData = res as Product;
    });

    this.setFormValues();
  }

  setFormValues(): void {
    if (this.productData) {
      this.productId = this.productData.ProductId;
      this.furniture_images = this.productData.ProductImages.split(', ');
      this.setPickedColour(this.productData.Colour);
      this.newProductForm.patchValue({
        ProductImages: this.productData.ProductImages,
        Prize: this.productData.Prize,
        Discount: this.productData.Discount,
        Deposit: this.productData.Deposit,
        CustomPrize: this.productData.CustomPrize,
        Colour: this.picked_color,
        Sizes: this.productData.Sizes,
        ProductName: this.productData.ProductName,
        Category: this.productData.Category,
        StockQuantity: this.productData.StockQuantity,
        StockLimit: this.productData.StockLimit,
        MakePeriods: this.productData.MakePeriods,
        ShortDesc: this.productData.ShortDesc,
        LongDesc: this.productData.LongDesc
      });
    }
  }

  removeFormValues() {
    this.ms.resetProductComponent();
    this.newProductForm.reset();
  }

  createNewProduct() {
    this.newProductForm.patchValue({ ProductImages: this.returnString(this.furniture_images) });
    this.newProductForm.patchValue({ Colour: this.picked_color });
    
    if (!this.inUpdate) {
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
    } else {
      this.ps.updateProduct(this.productId, this.newProductForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.ns.showMessage(res.message as string, res.success);
            this.clearImages(this.furniture_images);
          } else {
            this.ns.showMessage(res.error as string, false);
          }
        },
        error: (err) => {
          this.ns.showMessage(err.error.error as string, false);
        }
      });
    }
    
    this.newProductForm.reset();
    this.furniture_images = [];
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
      this.picked_color = res.name.value + ', ' + color;
      this._color['background'] = color as string;
    });
  }

  setPickedColour(colorName: string) {
    console.log(colorName);
    this.picked_color = colorName;
    this._color['background'] = colorName.split(', ')[1];
  } 

  setFurnitureImages(event: any) {
    const file = event.target.files[0];
    this.set_loader = 1;
  
    let formData = new FormData();
    formData.append('image_file', file);
  
    fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': 'LJRyRowV6X9jxdkW62pN6jta'
      },
      body: formData
    })
      .then(res => res.blob())
      .then(res => {
        const cloudinaryForm = new FormData();
        cloudinaryForm.append('file', res);
        cloudinaryForm.append('cloud_name', 'dbdsfkcev');
        cloudinaryForm.append('upload_preset', 'furniture_api');
  
        return fetch('https://api.cloudinary.com/v1_1/dbdsfkcev/image/upload', {
          method: 'POST',
          body: cloudinaryForm
        });
      })
      .then(res => res.json())
      .then(res => {
        this.furniture_images.push(res.secure_url);
        this.set_loader = 0;
      })
      .catch(err => {
        this.ns.showMessage(err as string, false);
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