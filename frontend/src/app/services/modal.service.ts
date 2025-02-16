import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActionType, PqtModalDetails, Product, ProductQuantityTime } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modalOperation = new BehaviorSubject<ActionType | undefined>(undefined);
  modalOperation$: Observable<ActionType | undefined> = this.modalOperation.asObservable();

  //updating new product component

  private inUpdate = new BehaviorSubject<boolean>(false);
  private productData = new BehaviorSubject<Partial<Product> | null>(null);

  inUpdate$: Observable<boolean> = this.inUpdate.asObservable();
  productData$: Observable<Partial<Product> | null> = this.productData.asObservable();

  //pqt modal

  private pqtModalDetails = new BehaviorSubject<PqtModalDetails | null>(null);

  pqtModalDetails$: Observable<PqtModalDetails | null> = this.pqtModalDetails.asObservable();

  constructor() { }

  openModal(actionType: ActionType) {
    this.modalOperation.next(actionType);
  }

  closeModal(actionType: ActionType) {
    this.modalOperation.next(actionType);
  }

  updateProductComponent(inUpdate: boolean, productData: Partial<Product> | null) {
    this.inUpdate.next(inUpdate);
    this.productData.next(productData);
  }

  resetProductComponent() {
    this.inUpdate.next(false);
    this.productData.next(null);
  }

  updatePqtModalDetails(pqtModalDetails: PqtModalDetails) {
    this.pqtModalDetails.next(pqtModalDetails);
  }

  resetPqtModalDetails() {
    this.pqtModalDetails.next(null);
  }
}
