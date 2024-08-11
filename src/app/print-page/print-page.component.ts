import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss']
})
export class PrintPageComponent implements OnInit {

	@Input() printData: any;
  @Input() printSide = '';
  showFront = true;
  showBack = false;

  printDetails = {
    memberId: '12345678',
    accountId: '254345342645',
    name: 'fnlkjsfjksdb',
    memberRelation: 'nlkqnvk',
    annualIncome: '54+468546',
    gender: ';lk',
    dateOfBirth: '65665',
    occupation: 'fwqerwg',
    townCity: 'gefdadagdag',
    branch: 'gedfszvz',
    memTaluka: 'gregadsvads',
    areaLandmark: '',
    state: '',
    pinCode: '',
    contact: '',
    caste: 'na',
    martialStatus: 'na',
    age: 'na',
    emailId: 'na',
    memAadharNO: '',
    memPanNo: '',
    guarantorName: '',
    guarantorBusinessName: '',
    guarAadharNO: '',
    guarPanNo: '',
    guarantorContact: '',
    holderName: '',
    accountNo: '',
    bankName: '',
    bankAddress: '',
    ifscCode: ''
  }

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.printSide == 'front') {
      this.showFront = true;
      this.showBack = false;
    } else {
      this.showFront = false;
      this.showBack = true;
    }

    if (this.printData) {
      const printData = this.printData;
      this.printDetails = {...printData}; 
    }
  }
}