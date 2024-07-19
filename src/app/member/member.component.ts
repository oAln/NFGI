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
  createMemberTitle = 'Create New Member';
  updateMember = false;

  public memberForm = this.formBuilder.group({
    firstName: new FormControl('abc'),
    lastName: new FormControl('efg'),
    memberId: new FormControl('16'),
    accountId: new FormControl('1234456789 '),
    gender: new FormControl('Male'),
    accountStatus: new FormControl('Active'),
    occupation: new FormControl('farmer'),
    dateOfBirth: new FormControl('21/12/2021'),
    townCity: new FormControl('Allahapur'),
    branch: new FormControl('allahpur'),
    areaLandmark: new FormControl('Gita Niketan'),
    state: new FormControl('Uttar Pradesh'),
    pinCode: new FormControl('211006'),
    contact: new FormControl('123456789'),
    loanAmount: new FormControl('12123'),
    installment: new FormControl('1'),
    loanPurpose: new FormControl('1'),
    holderName: new FormControl('Abc'),
    bankName: new FormControl('UCO'),
    bankAccount: new FormControl('432543523'),
    bankAddress: new FormControl('Civil Lines'),
    ifscCode: new FormControl('uco0000211'),
    annualIncome: new FormControl('2311244'),
    nomineeName: new FormControl('Abc'),
    nomineeRelation: new FormControl('Abc'),
    nomineeDOB: new FormControl('Abc'),
    nomineeContact: new FormControl('Abc'),
    nomineeAddress: new FormControl('Abc'),
    nomineeCity: new FormControl('Abc'),
    nomineeDistrict: new FormControl('Abc'),
    guarantorName: new FormControl('xyz'),
    guarantorBusinessName: new FormControl('Loan'),
    guarantorContact: new FormControl('542535432'),
    documentPath: new FormControl(''),
  });

  constructor(private http: HTTPService, private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.getMemberData();
  }

  createMember() {
    this.showMember = false;
  }

  ngOnInit() {

  }

  submitForm() {
    this.createMemberTitle = 'Create New Member';
    this.showMember = true;
    console.log(JSON.stringify(this.memberForm.value));
    let formParams = new FormData();
    const url = 'member';
    const body = JSON.stringify(this.memberForm.value);
    formParams.append('file', body);
    if (this.updateMember) {
      this.http.update(url, formParams).subscribe(
        (data) => {
          this.updateMember = false;
          console.log(data);
        }, (error) => {
          this.updateMember = false;
          console.log(error);
        }
      )
    } else {
      this.http.create(url, body).subscribe(
        (data) => {
          console.log(data);
        }
      )
    }
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
    this.memberForm.patchValue({ documentPath: file });
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

  editMemberData(memberDetails: any) {
    this.createMemberTitle = 'Edit Member';
    this.showMember = false;
    this.updateMember = true;
    this.memberForm.patchValue(memberDetails);
  }

  deleteMemberData(memberDetails: any) {
    console.log(memberDetails);
  }
}
