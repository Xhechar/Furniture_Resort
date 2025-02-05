import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AdminStyles, TopBar } from '../interfaces/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  private topBar = new BehaviorSubject<TopBar | null>(null);

  topBar$: Observable<TopBar | null> = this.topBar.asObservable();
  
  setTopBar(topBar: TopBar | null) {
    this.topBar.next(topBar);
  }

}
