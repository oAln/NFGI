import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { HTTPService } from '../services/http.service';
import { environment } from '../../enviornment/enviornment';
import { SubjectService } from '../services/subject.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent {
  showMember = true;
  memberData: any = [];
  createMemberTitle = 'Create New Member';
  updateMember = false;
  currentId = null;
  showDeleteDialog = false;
  showPrintDialog = false;
  selectedMemberId: any;
  printDetails: any;
  printPageSide: any;
  uploadedFiles: string[] = [];

  public searchForm = this.formBuilder.group({
    customerName: new FormControl(''),
    memberId: new FormControl('')
  })

  public memberForm = this.formBuilder.group({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    memberRelation: new FormControl(''),
    memberId: new FormControl(''),
    accountId: new FormControl(''),
    gender: new FormControl(''),
    accountStatus: new FormControl('Active'),
    occupation: new FormControl(''),
    dateOfBirth: new FormControl(''),
    townCity: new FormControl(''),
    branch: new FormControl(''),
    memTaluka: new FormControl(''),
    areaLandmark: new FormControl(''),
    state: new FormControl(''),
    pinCode: new FormControl(''),
    contact: new FormControl(''),
    memAadharNO: new FormControl(''),
    memPanNo: new FormControl(''),
    loanPurpose: new FormControl(''),
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
    guarAadharNO: new FormControl(''),
    guarPanNo: new FormControl('')
  });

  constructor(private http: HTTPService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private subjectService: SubjectService) {
    this.getMemberData();
  }

  createMember() {
    this.showMember = false;
  }

  submitForm() {
    this.createMemberTitle = 'Create New Member';
    this.showMember = true;
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
          this.memberForm.reset();
          console.log(data);
        }, (error) => {
          this.memberForm.reset();
          this.updateMember = false;
          console.log(error);
        }
      )
    } else {
      this.http.create(url, formParams).subscribe(
        (data: any) => {
          if (data?.id && this.uploadedFiles.length) {
            this.uploadFiles(data?.id)
          } else {
            this.memberForm.reset();
            this.getMemberData();
          }
        }
      )
    }
  }

  uploadFiles(id: any) {
    const url = 'member';
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      const formParams = new FormData();
      formParams.append("document", this.uploadedFiles[i]);
      this.http.update(`${url}/${id}`, formParams).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
    }
    this.memberForm.reset();
    this.getMemberData();
  }

  updateMemberData(member: any) {
    member?.loans.sort((a: any, b: any) => b?.id - a?.id);
    member?.loans.map((loanData: any) => {
      const memberDetails = { ...member }
      memberDetails['loanAmount'] = loanData?.amount;
      memberDetails['installment'] = loanData?.installment;
      memberDetails['loanId'] = loanData?.id;
      memberDetails['loanStartDate'] = new Date(loanData?.issuedAt);
      memberDetails['accountStatus'] = loanData?.status || 'Active';
      if (loanData?.repayments?.length) {
        console.log(loanData?.repayments);
        memberDetails['collectionAmount'] = loanData?.repayments?.reduce(function (accumulator: any, currentValue: any) {
          const filteredAmount = ((currentValue?.amountPaid || 0) + (currentValue?.lateFees || 0));
          return accumulator + filteredAmount;
        }, 0);
        memberDetails['paymentDays'] = loanData?.repayments?.length;
      }
      this.memberData.push(memberDetails);
    });
  }

  getMemberData() {
    const apiEndPoint = 'member'
    this.http.get(apiEndPoint).subscribe(
      (memberDetails: any) => {
        this.memberData = [];
        memberDetails?.forEach((member: any) => {
          if (member?.loans?.length) {
            this.updateMemberData(member);
          }
          else {
            this.memberData.push(member);
          }
        });
        this.memberData.sort((a: any, b: any) => b?.id - a?.id);
      });
  }

  uploadDoc(event: any) {
    const files = event?.target?.files;
    if (files?.length) {
      for (var i = 0; i < files.length; i++) {
        this.uploadedFiles.push(files[i]);
      }
    }
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  downloadAllFile(memberInfo: any) {
    const id = memberInfo?.id
    this.httpClient
      .get(`${environment.apiUrl}/files/download-all/${id}`, { responseType: 'blob' as 'json', observe: 'response' })
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
    if (this.searchForm?.value?.customerName) params = params.set('firstName', this.searchForm?.value?.customerName);
    if (this.searchForm?.value?.memberId) params = params.set('memberId', this.searchForm?.value?.memberId);
    if (this.searchForm?.value?.customerName || this.searchForm?.value?.memberId) {
      this.http.get('member/search', params).subscribe((data: any) => {
        this.memberData = [];
        data?.forEach((member: any) => {
          if (member?.loans?.length) {
            this.updateMemberData(member);
          }
          else {
            this.memberData.push(member);
          }
        });
        this.memberData.sort((a: any, b: any) => b?.id - a?.id);
      });
    }
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
      this.getMemberData();
    });
    this.showDeleteDialog = false;
  }

  printPage(printSide: any, memberDetails: any) {
    this.printDetails = { ...memberDetails };
    this.printDetails['name'] = memberDetails?.firstName + ' ' + memberDetails?.lastName;
    this.showPrintDialog = true;
    this.printPageSide = printSide;
    console.log(printSide);
    this.subjectService.updateSubjectData(true);
  }

  cancelPrint() {
    this.showPrintDialog = false;
    this.subjectService.updateSubjectData(false);
  }

  printData() {
    window.print();
  }
}
