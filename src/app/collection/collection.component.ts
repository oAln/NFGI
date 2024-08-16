import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HTTPService } from '../services/http.service';
import * as XLSX from 'xlsx';
import { HttpParams } from '@angular/common/http';
import { getDayDiff } from '../util/helper';
import { AppConstants } from '../util/app.constant';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent {
  showAlert = false;
  alertText = '';
  totalMonths = AppConstants.totalMonths;
  collectionForm: FormGroup;
  disbursementForm: FormGroup;
  collectionData: any;
  disbursementData: any;
  memberData: any = [];
  showMemberData = true;
  showCollectionForm = false;
  showDisbursementForm = false;
  selectedCollectionMonth = ''
  selectedCollectionYear;
  memberDetails = {
    firstName: '',
    memberId: 0,
    loanAmount: 0,
    branch: '',
    accountStatus: '',
    loanStartDate: ''
  }

  currentDate = new Date();
  @ViewChild('collectionInput') collectionUpload?: any;
  @ViewChild('disburseInput') disburseUpload?: any;
  templateType = 'collection';

  public searchForm = this.formBuilder.group({
    customerName: new FormControl(''),
    memberId: new FormControl('')
  })

  constructor(private http: HTTPService, private formBuilder: FormBuilder) {
    this.selectedCollectionMonth = this.totalMonths[this.currentDate.getMonth()];
    this.selectedCollectionYear = this.currentDate.getFullYear();
    this.collectionForm = this.formBuilder.group({
      collectionDate: new FormControl(''),
      amountPaid: new FormControl(''),
      lateFees: new FormControl(''),
      accountStatus: new FormControl(''),
      loanId: new FormControl('')
    });


    this.disbursementForm = this.formBuilder.group({
      loanStartDate: new FormControl(''),
      amount: new FormControl(''),
      installment: new FormControl(''),
      memberId: new FormControl('')
    });

    this.getMemberData();
  }

  updateMemberData(member: any) {
    member?.loans.sort((a: any, b: any) => b?.id - a?.id);
    member?.loans.map((loanData: any) => {
      const memberDetails = { ...member }
      memberDetails['loanAmount'] = loanData?.amount;
      memberDetails['installment'] = loanData?.installment;
      memberDetails['loanId'] = loanData?.id;
      memberDetails['loanStartDate'] = loanData?.issuedAt;
      memberDetails['accountStatus'] = loanData?.status || 'Active';
      if (loanData?.repayments?.length) {
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

  closeLoanAccount(memberDetails: any, closeLoan?: any) {
    const member = this.memberData.filter((data: any) => data?.loanId == memberDetails?.loanId)[0];
    const collectedAmount = memberDetails?.amountPaid ? parseInt(memberDetails?.amountPaid) : 0;
    const totalCollectedAmount = collectedAmount + member?.collectionAmount;
    const loanDays = getDayDiff(this.memberDetails?.loanStartDate);
    if ((closeLoan || (totalCollectedAmount >= member?.loanAmount)) || (loanDays > 180)) {
      const loanId = member?.loanId;
      const url = 'loans';
      const body = {
        status: loanDays > 180 ? 'Dormant' : 'Closed'
      }
      this.http.putUpdate(`${url}/${loanId}`, body).subscribe(
        (data) => {
          // this.getMemberData();
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }

  showCollection(member: any) {
    this.memberDetails.firstName = member?.firstName;
    this.memberDetails.memberId = member?.memberId || undefined;
    this.memberDetails.loanAmount = member?.loanAmount || 0;
    this.memberDetails.branch = member?.branch;
    this.memberDetails.accountStatus = member?.accountStatus;
    this.memberDetails.loanStartDate = member?.loanStartDate;
    this.showCollectionForm = true;
    this.showMemberData = false;
    this.showDisbursementForm = false;
    this.collectionForm.patchValue({
      memberId: member?.memberId,
      loanId: member.loanId
    });
  }

  getFilteredData() {
    let params = new HttpParams()
    if (this.searchForm?.value?.customerName) params = params.set('firstName', this.searchForm?.value?.customerName)
    if (this.searchForm?.value?.memberId) params = params.set('memberId', this.searchForm?.value?.memberId)
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
      })
    }
  }

  showDisbursement(member: any) {
    this.memberDetails.firstName = member?.firstName;
    this.memberDetails.memberId = member?.memberId || undefined;
    this.memberDetails.branch = member?.branch;
    this.memberDetails.accountStatus = member?.accountStatus;
    this.showDisbursementForm = true;
    this.showMemberData = false;
    this.showCollectionForm = false;
    this.disbursementForm.patchValue({
      memberId: member?.memberId
    });
  }

  submitTemplateData() {
    if (this.templateType == 'collection') {
      let body: any = {};
      const currentDate = new Date();
      const propertArray = ['Sr_No', 'Loan_Id', 'Membership_Name', 'Late_Fees'];
      currentDate.setMonth(this.totalMonths.indexOf(this.selectedCollectionMonth));
      currentDate.setFullYear(this.selectedCollectionYear);
      this.collectionData.forEach((collection: any) => {
        Object.keys(collection).forEach((data: any) => {
          body['status'] = 'Active';
          body['loanId'] = collection.Loan_Id;
          body['lateFees'] = collection.Late_Fees;
          if (propertArray.indexOf(data) < 0) {
            body['paymentDate'] = new Date(currentDate.setDate(data));
            body['amountPaid'] = collection[data];
            this.saveCollectionData(body);
          }
        });
      });
    } else {
      let body: any = {};
      this.disbursementData.forEach((data: any) => {
        body['issuedAt'] = this.formatDate(data?.Loan_Start_Date);
        body['amount'] = data?.Loan_Amount;
        body['memberId'] = data?.Membership_Id;
        body['accountStatus'] = 'Active';
        body['installment'] = data?.Installment;
        this.saveDisburseData(body);
      });
    }
    this.showAlert = true;
    this.alertText = "Template Submitted Successfully.";
    window.scrollTo(0,0);
    this.hideAlert();
    this.collectionUpload['nativeElement']['value'] = null;
    this.disburseUpload['nativeElement']['value'] = null;
  }

  formatDate(selectedDate: any) {
    const dateParts = selectedDate.split("/");

    // month is 0-based, that's why we need dataParts[1] - 1
    return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
  }

  submitCollectionForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    let body = this.collectionForm?.value;
    if (this.collectionForm?.value?.accountStatus) {
      body.accountStatus = 'Closed';
      this.closeLoanAccount(body, true);
    } else {
      body.accountStatus = 'Active';
    }
    body['paymentDate'] = new Date(this.collectionForm?.value?.collectionDate);

    this.saveCollectionData(body);
    this.collectionForm.reset();
  }

  submitDisbursementForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    const body = this.disbursementForm.value;
    body['issuedAt'] = new Date(this.disbursementForm?.value?.loanStartDate);
    body['accountStatus'] = 'Active';
    body['memberId'] = this.disbursementForm?.value?.memberId.trim();
    this.saveDisburseData(body);
    this.disbursementForm.reset();
  }

  saveCollectionData(body: any) {
    if (body?.amountPaid || body?.lateFees) {
      this.closeLoanAccount(body);
      const apiEndPoint = 'repayments'
      this.http.create(apiEndPoint, body).subscribe(
        (data) => {
          this.getMemberData();
        }, (error) => {
          console.log(error);
        }
      )
    } else {
      this.getMemberData();
    }
  }

  saveDisburseData(body: any) {
    if (body?.amount) {
      const apiEndPoint = 'loans';
      this.http.create(apiEndPoint, body).subscribe(
        (data) => {
          this.getMemberData();
        }, (error) => {
          console.log(error);
        }
      )
    }
  }

  getExcelData(ev: any, dataType: string): void {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = () => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet, {
          raw: false,
          dateNF: "dd/mm/yyyy"
        });
        return initial;
      }, {});
      if (jsonData?.Sheet1?.length > 1) {
        jsonData?.Sheet1?.splice(jsonData?.Sheet1?.length - 1, 1);
        if (dataType === 'collection') {
          this.collectionData = jsonData?.Sheet1;
          this.templateType = 'collection';
        } else {
          this.disbursementData = jsonData?.Sheet1;
          this.templateType = 'disburse';
        }
      }

    };
    reader.readAsBinaryString(file);
  }

  hideAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 5 * 1000);
  }
}
