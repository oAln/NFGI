import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html'
})
export class PrintPageComponent implements OnInit {

  memberDetails: any;

  constructor() { }

  ngOnInit() {
    this.memberDetails.memberId = 'wer'
  }

}