import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../services/http.service';
import * as XLSX from 'xlsx';
import { getIntererstAmount } from '../util/helper';
import { AppConstants } from '../util/app.constant';
// import * as Excel from "exceljs";

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
    excelData: any = [[], []];

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
                this.memberData.map((member: any) => {
                    member['loanData'] = getIntererstAmount(member);
                });
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

    generateReport(reportType?: string): void {
        switch (reportType) {
            case 'simple':
                const excelHeader = AppConstants.accountStatementHeaders;
                excelHeader.forEach((data, index) => {
                    this.excelData[0].push(data?.header);
                    this.excelData[0].push(data?.header);
                });
                break;

            default:
                break;
        }
        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, 'NFGI-Report.xlsx');
    }

    ngOnInit() { }

    
//   async downloadExcel() {
//     const date = new Date()
//       .toISOString()
//       .slice(0, 10)
//       .split("-")
//       .reverse()
//       .join("/");
//     console.log(date);
//     const workbook = new Excel.Workbook();
//     const worksheet = workbook.addWorksheet("My Sheet");

//     worksheet.columns = [
//       { header: "Id", key: "id", width: 10 },
//       { header: "Name", key: "name", width: 32 },
//       { header: "D.O.B.", key: "dob", width: 15 }
//     ];

//     worksheet.addRow({ id: 1, name: "John Doe", dob: new Date(1970, 1, 1) });
//     worksheet.addRow({ id: 2, name: "Jane Doe", dob: new Date(1965, 1, 7) });

//     workbook.xlsx.writeBuffer().then((data: any) => {
//       console.log("buffer");
//       const blob = new Blob([data], {
//         type:
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//       });
//       let url = window.URL.createObjectURL(blob);
//       let a = document.createElement("a");
//       document.body.appendChild(a);
//       a.setAttribute("style", "display: none");
//       a.href = url;
//       a.download = "export.xlsx";
//       a.click();
//       window.URL.revokeObjectURL(url);
//       a.remove();
//     });
//   }

}
