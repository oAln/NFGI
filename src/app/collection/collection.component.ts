import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  showCollection = true;
  public collectionForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.collectionForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      memberId: new FormControl(''),
      accountNo: new FormControl(''),
      gender: new FormControl(''),
      accountStatus: new FormControl(''),
      occupation: new FormControl(''),
      dob: new FormControl(''),
      town: new FormControl(''),
      branch: new FormControl(''),
      area: new FormControl(''),
      state: new FormControl(''),
      pinCode: new FormControl(''),
      contact: new FormControl(''),
      loanAmount: new FormControl(''),
      installment: new FormControl(''),
      bankHolderName: new FormControl(''),
      bankAccountNo: new FormControl(''),
      bankName: new FormControl(''),
      bankAddress: new FormControl(''),
      ifscCode: new FormControl(''),
      income: new FormControl(''),
      guarantorName: new FormControl(''),
      guarantorBusinessName: new FormControl(''),
      guarantorContact: new FormControl(''),
      document: new FormControl(''),
    });
  }

  createCollection() {
    this.showCollection = false;
  }


  createDisbursement() {
    console.log('disbures');
    
  }

  ngOnInit() {

  }

  collectionTemplate () {

  }

  disbursementTemplate() {
    
  }
  submitForm() {
    this.showCollection = true;
    console.log(JSON.stringify(this.collectionForm.value));

  }
}
