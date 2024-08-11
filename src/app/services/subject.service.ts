import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor() {}

  // declare and initialize the quote property
  // which will be a BehaviorSubject
  printPage = new BehaviorSubject(false);

  // expose the BehaviorSubject as an Observable
  printData = this.printPage.asObservable();

  // function to update the value of the BehaviorSubject
  updateSubjectData(print: boolean){
    this.printPage.next(print);
  }
}