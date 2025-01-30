import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { NotificationsService } from '../../services/notifications.service';
import { UserService } from '../../services/user.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule, TopbarComponent, NotificationsComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  load: boolean = false;

  registerUserForm!: FormGroup;imageUrl: string = '';

  constructor(private fb: FormBuilder, private ns: NotificationsService, private us: UserService, private router: Router) {
    this.registerUserForm = fb.group({
      Fullname: ['', [Validators.required, validateFullname()]],
      Email: ['', [Validators.required, Validators.email, validateEmail()]],
      Password: ['', [Validators.required, Validators.minLength(8), validatePassword()]],
      ConfirmPassword: ['', [Validators.required, validateConfirmPassword()]],
      Mobile: ['', [Validators.required, Validators.pattern(/^\+\d{10}$/), validateMobile()]],
      Country: ['', [Validators.required, validateCountry()]],
      City: ['', [Validators.required, validateCity()]],
      Gender: ['', [Validators.required, validateGender()]],
      IdentificationNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,}$/), validateIdentificationNumber()]],
      ProfileImage: ['']
    });
  }
  
  getImageUrl(event: any) {
    this.imageUrl = '';
    let file_type = event.target.files[0].type;

    if (!file_type.startsWith('image/')) {
      this.ns.showMessage('Only images are allowed', false);
    }

    this.load = true;

    let formData = new FormData();

    formData.append('file', event.target.files[0]);
    formData.append('cloud_name', 'dakyiye2e');
    formData.append('upload_preset', 'furniture-site-images');

    fetch('https://api.cloudinary.com/v1_1/dakyiye2e/image/upload', {
      method: 'POST',
      body: formData
    }).then(res => res.json()).then((res) => {
      this.imageUrl = res.secure_url;
      this.load = false;
      this.registerUserForm.patchValue({
        ProfileImage: res.secure_url
      });
    })
    
  }

  registerUser() {
    let finalValue = { ...this.registerUserForm.value };
    delete finalValue.ConfirmPassword;

    this.us.createUser(finalValue).subscribe({
      next: (res) => {
        if (res.success) {
          this.ns.showMessage(res.message as string, true);
          this.router.navigate(['/login']);
        } else {
          this.ns.showMessage(res.error as string, false);
        }
      },
      error: (err) => {
        this.ns.showMessage(err.error.error as string, false);
      }
    });

    this.registerUserForm.reset();
    this.imageUrl = '';
  }
}

const validatePassword = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;

    if (!value) {
      return { 'required': true }
    }

    if (value.length < 8) {
      return { 'passwordLength': true }
    } else {
      let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!pattern.test(value)) {
        return { 'passwordPattern': true }
      }
      return null;
    }
  }
}

const validateConfirmPassword = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let password: string = control.parent?.get('Password')?.value;
    let confirmPassword: string = control.value;
    
    if (!confirmPassword) {
      return { 'required': true }
    }
    
    if (password !== confirmPassword) {
      return { 'passwordMismatch': true }
    }
    return null;
  }
}

const validateMobile = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }

    if (!/^0{1}[17]{1}[0-9]{8}$/.test(value)) {
      return { 'invalidMobile': true }
    }
    return null;
  }
}

const validateIdentificationNumber = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (!/^[0-9]{8,}$/.test(value)) {
      return { 'invalidIdentificationNumber': true }
    }
    return null;
  }
}

const validateEmail = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
      return { 'invalidEmail': true }
    }
    return null;
  }
}

const validateGender = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (value.length < 3 || value.length > 30) {
      return { 'invalidGender': true }
    }
    return null;
  }
}

const validateCity = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (value.length < 3 || value.length > 50) {
      return { 'invalidCity': true }
    }
    return null;
  }
}

const validateCountry = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (value.length < 3 || value.length > 50) {
      return { 'invalidCountry': true }
    }
    return null;
  }
}

const validateFullname = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value;
    
    if (!value) {
      return { 'required': true }
    }
    
    if (value.length < 5 || value.length > 100) {
      return { 'invalidFullname': true }
    }
    return null;
  }
}