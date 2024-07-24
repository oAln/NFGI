import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HTTPService } from '../services/http.service';
import * as XLSX from 'xlsx';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  collectionForm: FormGroup;
  disbursementForm: FormGroup;
  collectionData: any;
  disbursementData: any;
  memberData: any;
  showMemberData = true;
  showCollectionForm = false;
  showDisbursementForm = false;
  memberDetails = {
    firstName: '',
    memberId: 0,
    loanAmount: 0,
    branch: '',
    accountStatus: ''
  }

  public searchForm=this.formBuilder.group({
    customerName: new FormControl(''),
    memberId: new FormControl('')
  })

  constructor(private http: HTTPService, private formBuilder: FormBuilder) {
    this.collectionForm = this.formBuilder.group({
      collectionDate: new FormControl(''),
      collectionAmount: new FormControl(''),
      lateFees: new FormControl(''),
      accountStatus: new FormControl('')
    });


    this.disbursementForm = this.formBuilder.group({
      loanStartDate: new FormControl(''),
      loanAmount: new FormControl(''),
      installment: new FormControl('')
    });

    this.getMemberData();
  }

  getMemberData() {
    const apiEndPoint = 'member'
    this.http.get(apiEndPoint).subscribe(
      (data) => {
        console.log(data);

        this.memberData = data;
      });
  }

  showCollection(member: any) {
    this.memberDetails.firstName = member?.firstName;
    this.memberDetails.memberId = member?.memberId || undefined;
    this.memberDetails.loanAmount = member?.loanAmount || 0;
    this.memberDetails.branch = member?.branch;
    this.memberDetails.accountStatus = member?.accountStatus;
    this.showCollectionForm = true;
    this.showMemberData = false;
    this.showDisbursementForm = false;
  }

  getFilteredData(){
    let params = new HttpParams()
    if(this.searchForm.value.customerName) params=params.set('firstName',this.searchForm.value.customerName)
    if(this.searchForm.value.memberId) params=params.set('memberId',this.searchForm.value.memberId)    
    this.http.get('member/search',params).subscribe((data)=>this.memberData=data)
   }


  showDisbursement(member: any) {
    this.memberDetails.firstName = member?.firstName;
    this.memberDetails.memberId = member?.memberId || undefined;
    this.memberDetails.branch = member?.branch;
    this.memberDetails.accountStatus = member?.accountStatus;
    this.showDisbursementForm = true;
    this.showMemberData = false;
    this.showCollectionForm = false;
  }

  ngOnInit() {

  }

  submitTemplateData() {
    console.log('submit template data');

  }

  submitCollectionForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    let body = this.collectionForm?.value;
    if (this.collectionForm?.value?.accountStatus) {
      body.accountStatus = 'Closed';
    } else {
      body.accountStatus = 'Active';
    }
    const url = 'member';
    this.http.update(`${url}/${this.memberDetails.memberId}`, body).subscribe(
      (data) => {console.log(data);
      
      }, (error) => {
        console.log(error);
      }
    )
  }

  submitDisbursementForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    const url = 'member';
    this.http.update(`${url}/${this.memberDetails.memberId}`, this.disbursementForm?.value).subscribe(
      (data) => {
        console.log(data);
        
      }, (error) => {
        console.log(error);
      }
    )

  }

  getExcelData(ev: any, dataType: string): void {
    let workBook: any = null;
    let jsonData = null;
    const reader = new FileReader();
    console.log('Imorted file', ev.target.files);
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
        if (dataType === 'collection') {
          this.collectionData = jsonData?.Sheet1?.splice(0, jsonData?.Sheet1?.length - 1);
          console.log('this.collectionData', this.collectionData);
        } else {
          this.disbursementData = jsonData?.Sheet1?.splice(0, jsonData?.Sheet1?.length - 1);
          console.log('this.disbursementData', this.disbursementData);
        }
      }

    };
    reader.readAsBinaryString(file);
  }
}
