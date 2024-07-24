import { HttpClient, HttpParams } from '@angular/common/http';
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
  currentId = null;
  showDeleteDialog = false;
  selectedMemberId: any;

  public searchForm = this.formBuilder.group({
    customerName: new FormControl(''),
    memberId: new FormControl('')
  })

  public memberForm = this.formBuilder.group({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    memberId: new FormControl(''),
    accountId: new FormControl(''),
    gender: new FormControl(''),
    accountStatus: new FormControl(''),
    occupation: new FormControl(''),
    dateOfBirth: new FormControl(''),
    townCity: new FormControl(''),
    branch: new FormControl(''),
    areaLandmark: new FormControl(''),
    state: new FormControl(''),
    pinCode: new FormControl(''),
    contact: new FormControl(''),
    loanAmount: new FormControl(''),
    installment: new FormControl(''),
    loanPurpose: new FormControl('1'),
    holderName: new FormControl(''),
    bankName: new FormControl(''),
    accountNo: new FormControl(''),
    bankAddress: new FormControl(''),
    ifscCode: new FormControl(''),
    annualIncome: new FormControl(''),
    nomineeName: new FormControl(''),
    nomineeRelation: new FormControl(''),
    nomineeDOB: new FormControl(''),
    nomineeContact: new FormControl(''),
    nomineeAddress: new FormControl(''),
    nomineeCity: new FormControl(''),
    nomineeDistrict: new FormControl(''),
    guarantorName: new FormControl(''),
    guarantorBusinessName: new FormControl(''),
    guarantorContact: new FormControl(''),
    document: new FormControl('')
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
    console.log(this.memberForm.value);
    let formParams = new FormData();
    Object.entries(this.memberForm.value).forEach(([key, value]) => {
      if (value)
        formParams.append(key, value)
    })
    const url = 'member';
    if (this.updateMember) {
      this.http.update(`${url}/${this.currentId}`, formParams).subscribe(
        (data) => {
          this.getMemberData();
          this.updateMember = false;
        }, (error) => {
          this.updateMember = false;
          console.log(error);
        }
      )
    } else {
      this.http.create(url, formParams).subscribe(
        (data) => {
          this.getMemberData();
        }
      )
    }
  }

  getMemberData() {
    const apiEndPoint = 'member'
    this.http.get(apiEndPoint).subscribe(
      (data) => {
        console.log('member...', data);
        this.memberData = data;
      });
  }

  uploadDoc(event: any) {
    const file = event?.target?.files?.[0];
    this.memberForm.patchValue({ document: file });
  }

  downloadFile(memberInfo: any) {
    const fileId = memberInfo?.files?.[0]?.id;
    if (!fileId) {
      throw new Error("File id not present")
    }
    const id = memberInfo?.id
    this.httpClient
      .get(`${environment.apiUrl}/files/download/${id}/${fileId}`, { responseType: 'blob' as 'json', observe: 'response' })
      .subscribe((response: any) => {
        const fileName = this.getFileNameFromContentDisposition(response)
        const url = window.URL.createObjectURL(response.body);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }

  getFileNameFromContentDisposition(response: any): string {
    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const matches = /filename="([^"]*)"/.exec(contentDisposition);
      if (matches && matches[1]) {
        return matches[1];
      }
    }
    return 'download';
  }

  editMemberData(memberDetails: any) {
    this.createMemberTitle = 'Edit Member';
    this.showMember = false;
    this.updateMember = true;
    this.currentId = memberDetails.id;
    this.memberForm.patchValue(memberDetails);
  }

  getFilteredData() {
    let params = new HttpParams()
    if (this.searchForm.value.customerName) params = params.set('firstName', this.searchForm.value.customerName)
    if (this.searchForm.value.memberId) params = params.set('memberId', this.searchForm.value.memberId)
    this.http.get('member/search', params).subscribe((data) => this.memberData = data)
  }

  cancelDeleteMemberData() {
    this.showDeleteDialog = false;
    this.selectedMemberId = null;
  }

  deleteMember(memberDetails: any) {
    this.showDeleteDialog = true;
    this.selectedMemberId = memberDetails?.id;
  }

  deleteMemberData() {
    this.http.delete(`member`, this.selectedMemberId).subscribe((data) => {
      this.memberData = data;
    })
  }
}
