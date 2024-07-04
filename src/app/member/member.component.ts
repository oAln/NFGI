import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  showMember = true;
  public memberForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.memberForm = this.formBuilder.group({
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

  createMember() {
    this.showMember = false;
  }

  ngOnInit() {

  }

  submitForm() {
    this.showMember = true;
    console.log(JSON.stringify(this.memberForm.value));

  }
}
