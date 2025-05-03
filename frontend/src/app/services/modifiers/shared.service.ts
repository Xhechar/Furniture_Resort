import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  static API_URL = 'https://ndagani-sf-backend.onrender.com/';

  constructor() { }
}
