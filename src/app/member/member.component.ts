import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HTTPService } from '../services/http.service';
import { environment } from '../../enviornment/enviornment';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  showMember = true;
  memberData: any;
  public memberForm = this.formBuilder.group({
    firstName: new FormControl('abc'),
    lastName: new FormControl('efg'),
    memberId: new FormControl('16'),
    gender: new FormControl('Male'),
    occupation: new FormControl('farmer'),
    townCity: new FormControl('Allahapur'),
    areaLandmark: new FormControl('Gita Niketan'),
    pinCode: new FormControl('211006'),
    accountNo: new FormControl('1234456789 '),
    accountStatus: new FormControl('Active'),
    dateOfBirth: new FormControl('21/12/2021'),
    branch: new FormControl('allahpur'),
    state: new FormControl('Uttar Pradesh'),
    contact: new FormControl('123456789'),
    loanAmount: new FormControl('12123'),
    installment: new FormControl('1'),
    holderName: new FormControl('Abc'),
    bankName: new FormControl('UCO'),
    ifscCode: new FormControl('uco0000211'),
    bankAddress: new FormControl('Civil Lines'),
    annualIncome: new FormControl('2311244'),
    holderBankAccount: new FormControl('432543523'),
    guarantorName: new FormControl('xyz'),
    guarantorBusinessName: new FormControl('Loan'),
    guarantorContact: new FormControl('542535432'),
    documentPath: new FormControl(''),
  });

  constructor(private http:HTTPService, private httpClient:HttpClient, private formBuilder: FormBuilder) {
    this.getMemberData();
  }

  createMember() {
    this.showMember = false;
  }

  ngOnInit() {

  }

  submitForm() {
    this.showMember = true;
    console.log(JSON.stringify(this.memberForm.value));
    let formParams = new FormData();
    let url = `http://localhost:3000/member`;
    let obje1 = JSON.stringify(this.memberForm.value);
    formParams.append('file', obje1)
    //this.httpClient.post(`http://127.0.0.1:12201/gelf`,{name:'mark',age:'32'}).subscribe(
      this.httpClient.post(url,formParams).subscribe(
      (data) => {
          console.log(data);
      }
    )
  }

  getMemberData() {
    const apiEndPoint = 'member'
    this.http.get(apiEndPoint).subscribe(
      (data) => {
        console.log(data);
        
          this.memberData = data;
      });
  }

  uploadDoc(event: any) {
    const file = event?.target?.files[0];
    // const file = (event?.target as HTMLInputElement)?.files[0] || {}; // Here we use only the first file (single file)
    this.memberForm.patchValue({ documentPath: file});
  }

  downloadFile(filePath: any) {
    this.httpClient
      .get(`${environment.apiUrl}` + '/' + filePath, { responseType: 'blob' })
      .subscribe((response: any) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'test';
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }
}
