import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  showpassword = true;
  public passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.passwordForm = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      passwordId: new FormControl(''),
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

  createpassword() {
    this.showpassword = false;
  }

  ngOnInit() {

  }

  submitForm() {
    this.showpassword = true;
    console.log(JSON.stringify(this.passwordForm.value));

  }
}
