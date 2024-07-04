import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.createUserForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
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


  ngOnInit() {

  }

  changePassword() {

  }

  deleteUser() {

  }

  submitForm() {
    console.log(JSON.stringify(this.createUserForm.value));

  }
}
