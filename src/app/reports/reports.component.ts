import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../services/http.service';

@Component({
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    monthData: string[] = [];
    totalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    selectedMonth = 'January';
    selectedBranch = '';
    branchData: any;
    selectedLoanDuration = 30;
    loanDurationData = [30, 60, 90, 120, 150, 180]
    memberData: any;

    constructor(private http: HTTPService) {
        this.getMemberData();
        const currentDate = new Date();
        this.monthData = this.totalMonths.slice(0, currentDate.getMonth() + 1);
    }

    onBranchSelect(selectedBranch: any) {
        console.log('selectedBranch', selectedBranch);
    }

    onMonthSelect(selectedMonth: any) {
        console.log('selectedMonth', selectedMonth);
    }

    getMemberData() {
        const apiEndPoint = 'member'
        this.http.get(apiEndPoint).subscribe(
            (memberDetails: any) => {
                this.memberData = memberDetails;
                console.log(this.memberData);
                this.branchData = this.memberData.reduce((acc: any, data: any) => {
                    if (!acc.includes(data.branch)) {
                        acc.push(data.branch);
                    }
                    return acc;
                }, []);
                this.selectedBranch = this.branchData?.length ? this.branchData[0] : "";
            });
    }

    onLoanDurationSelect(loanDuration: any) {
        console.log('loanDuration', loanDuration);
    }

    generateReport() {
        console.log('generate report');
        
    }

    ngOnInit() { }

}
