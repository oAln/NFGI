import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HTTPService } from '../services/http.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
  public collectionForm: FormGroup;
  public disbursementForm: FormGroup;
  memberData: any;
  showMemberData = true;
  showCollectionForm = false;
  showDisbursementForm = false;
  memberDetails = {
    firstName: '',
    memberId: 0,
    loanAmount: 0,
    branch: '',
    status: ''
  }

  constructor(private http:HTTPService, private formBuilder: FormBuilder) {
    this.collectionForm = this.formBuilder.group({
      collectionDate: new FormControl(''),
      collectionAmount: new FormControl(''),
      lateFees: new FormControl(''),
      status: new FormControl('')
    });


    this.disbursementForm = this.formBuilder.group({
      disbursementDate: new FormControl(''),
      disbursementAmount: new FormControl(''),
      disbursementInstallment: new FormControl('')
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
    this.memberDetails.firstName = member?.firstName || '';
    this.memberDetails.loanAmount = member?.loanAmount || 0;
    this.memberDetails.branch = member?.branch || '';
    this.showCollectionForm = true;
    this.showMemberData = false;
    this.showDisbursementForm = false;
  }


  showDisbursement(member: any) {
    this.memberDetails.firstName = member?.firstName || '';
    this.memberDetails.memberId = member?.memberId || 0;
    this.memberDetails.branch = member?.branch || '';
    this.memberDetails.status = member?.accountStatus || '';
    this.showDisbursementForm = true;
    this.showMemberData = false;
    this.showCollectionForm = false;
  }

  ngOnInit() {

  }

  collectionTemplate () {
    console.log('download collection excel');
  }

  disbursementTemplate() {
    console.log('download disburse excel');
  }

  submitTemplateData() {
    console.log('submit template data');
    
  }

  submitCollectionForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    console.log(JSON.stringify(this.collectionForm.value));

  }

  submitDisbursementForm() {
    this.showMemberData = true;
    this.showDisbursementForm = false;
    this.showCollectionForm = false;
    console.log(JSON.stringify(this.collectionForm.value));

  }
}
