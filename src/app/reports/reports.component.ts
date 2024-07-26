import { Component, OnInit } from '@angular/core';
import { HTTPService } from '../services/http.service';
import * as XLSX from 'xlsx';
import { getDayDiff, getIntererstAmount } from '../util/helper';
import { AppConstants } from '../util/app.constant';
import { ExcelService } from '../services/excel.service';
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
    simpleExcelData: any = [];
    excelData: any = [];

    constructor(private http: HTTPService, private excelService: ExcelService) {
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

    updateMemberData(member: any) {
        member?.loans.map((loanData: any) => {
            const memberDetails = { ...member }
            memberDetails['loanAmount'] = loanData?.amount;
            memberDetails['installment'] = loanData?.installment;
            memberDetails['loanId'] = loanData?.id;
            memberDetails['loanStartDate'] = loanData?.issuedAt;
            this.memberData.push(memberDetails);
        });
    }

    getMemberData() {
        const apiEndPoint = 'member'
        this.http.get(apiEndPoint).subscribe(
            (memberDetails: any) => {
                memberDetails?.forEach((member: any) => {
                    if (member?.loans?.length) {
                        this.updateMemberData(member);
                    }
                    else {
                        this.memberData.push(member);
                    }
                });
                this.memberData.map((member: any) => {
                    if (member?.repayments?.length) {
                        member['collectionAmount'] = member?.repayments?.reduce(function (accumulator: any, currentValue: any) {
                            const filteredAmount = currentValue?.amountPaid;
                            return accumulator + filteredAmount;
                        }, 0);
                    };
                    member['paymentDays'] = member?.repayments?.length;
                });
                console.log(this.memberData);

            });
    }

    getSimpleExcelData(memberData: any) {
        const members = memberData;
        const simpleExcel = AppConstants.accountStatementHeaders;

        simpleExcel.map((excelKey: any, index) => {
            excelKey['index'] = index + 1;
            excelKey['loanStartDate'] = this.getMemberProp('loanStartDate');
        })


    }

    getMemberProp(key: any) {
        return this.memberData[key]
    }

    onLoanDurationSelect(loanDuration: any) {
        console.log('loanDuration', loanDuration);
    }

    getMemberMonthData(month: string) {
        const selectedMonthNumber = this.totalMonths.indexOf(this.selectedMonth);
        const filterMemberData = this.memberData.filter((member: any) => {
            const loanDate = new Date(member?.loanStartDate).getMonth()
            if (member?.loanId && member?.loanStartDate && loanDate == selectedMonthNumber) {
                return member;
            }
        })
        return filterMemberData;
    }

    getMemberExcelData(member: any, index: any) {
        const simpleExcelProperties = AppConstants.accountStatementHeaders;
        const obj: any = {};
        const loanDays: any = getDayDiff(member?.loanStartDate);
        let lateFees = 0;
        let totalCollectedamount = 0;
        simpleExcelProperties.map((property: any) => {
            if (property.key == 'loanDuration') {
                obj[property.header] = loanDays;
            } else if (property.key == 'index') {
                obj[property.header] = index + 1;
            } else if (member?.[property.key]) {
                obj[property.header] = member[property.key];
            } else {
                switch (property.key) {
                    case 'maturedAmount30':
                        lateFees = (loanDays > 30) ? (loanDays - 30) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.05 + lateFees;
                        break;
                    case 'maturedAmount60':
                        lateFees = (loanDays > 60) ? (loanDays - 60) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.1 + lateFees;
                        break;
                    case 'maturedAmount90':
                        lateFees = (loanDays > 90) ? (loanDays - 90) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.15 + lateFees;
                        break;
                    case 'maturedAmount120':
                        lateFees = (loanDays > 120) ? (loanDays - 120) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.2 + lateFees;
                        break;
                    case 'maturedAmount150':
                        lateFees = (loanDays > 150) ? (loanDays - 150) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.25 + lateFees;
                        break;
                    case 'maturedAmount180':
                        lateFees = (loanDays > 180) ? (loanDays - 180) * 16.67 : 0;
                        obj[property.header] = member?.loanAmount * 1.3 + lateFees;
                        break;
                    case 'term':
                    case 'lateFees':
                        let loanTerm = 30;
                        if (loanDays <= 35) {
                            loanTerm = 30;
                        } else if (loanDays > 35 && loanDays <= 65) {
                            loanTerm = 60;
                        } else if (loanDays > 65 && loanDays <= 95) {
                            loanTerm = 90;
                        } else if (loanDays > 95 && loanDays <= 125) {
                            loanTerm = 120;
                        } else if (loanDays > 125 && loanDays <= 155) {
                            loanTerm = 150;
                        } else {
                            loanTerm = 180;
                        }
                        if (property.key == 'lateFees') {
                            lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
                            obj[property.header] = lateFees;
                        } else {
                            obj[property.header] = loanTerm;
                        }
                        break;
                    case 'totalCollectedamount':
                        totalCollectedamount = this.memberData.reduce(function (accumulator: any, currentValue: any) {
                            const filteredAmount = (currentValue?.loanId === member?.loanId) ? currentValue?.collectionAmount : 0;
                            return accumulator + filteredAmount;
                        }, 0);
                        obj[property.header] = totalCollectedamount;
                        break;
                    case 'remainingAmount30':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[5].header];
                        break;
                    case 'remainingAmount60':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[6].header];
                        break;
                    case 'remainingAmount90':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[7].header];
                        break;
                    case 'remainingAmount120':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[8].header];
                        break;
                    case 'remainingAmount150':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[9].header];
                        break;
                    case 'remainingAmount180':
                        obj[property.header] = totalCollectedamount - obj[simpleExcelProperties[10].header];
                        break;
                    case 'totalAmount':
                        const appliedLoanTerm = obj[simpleExcelProperties[22].header];
                        const defaultLoanTerms = AppConstants.loanTerms;
                        const loanInterest = defaultLoanTerms.find((loanTerm: any) => loanTerm.term === appliedLoanTerm || {})?.rate || 1.05;
                        obj[property.header] = member?.loanAmount * loanInterest + obj[simpleExcelProperties[24].header];
                        break;
                    case 'loanOverdue':
                        obj[property.header] = member?.loanAmount + obj[simpleExcelProperties[24].header];
                        break;

                    default:
                        break;
                }
            }
        })
        this.simpleExcelData.push(obj)
    }

    generateReport(reportType?: string): void {
        const filteredMemberData = this.getMemberMonthData(this.selectedMonth);
        switch (reportType) {
            case 'simple':
                filteredMemberData.forEach((member: any, index: any) => {
                    this.getMemberExcelData(member, index);
                });
                this.excelData.push(Object.keys(this.simpleExcelData[0]));
                this.simpleExcelData.forEach((data: any) => {
                    if (Object.keys(this.simpleExcelData[0])?.length == Object.values(data)?.length) {
                        this.excelData.push(Object.values(data));
                    }
                });
                break;

            case 'branchwise':
                const branchWiseDetails: any = {
                    LoanAmount: 0,
                    MaturedLoanAmount: 0,
                    Installments: 0,
                    Recovey: 0,
                    Balance: 0,
                };
                const branch = this.selectedBranch;
                const defaultLoanTerms = AppConstants.loanTerms;
                const loanterm = defaultLoanTerms.find((termData: any) => termData.term === this.selectedLoanDuration || {})?.term;
                branchWiseDetails.LoanAmount = this.getTotalAmount(filteredMemberData, branch, 'loanAmount');
                branchWiseDetails.Installments = this.getTotalAmount(filteredMemberData, branch, 'installment');
                branchWiseDetails.MaturedLoanAmount = filteredMemberData.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = (currentValue?.branch === branch && currentValue?.LoanData?.loanTerm == loanterm) ? currentValue?.LoanData?.maturedAmount : 0;
                    return accumulator + filteredAmount;
                }, 0);
                branchWiseDetails.Recovey = this.getTotalAmount(filteredMemberData, branch, 'collectionAmount');
                // 120 days recovery amount 
                const recovryAmount = filteredMemberData.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = (currentValue?.branch === branch && currentValue?.LoanData?.loanTerm == loanterm) ? currentValue?.collectionAmount : 0;
                    return accumulator + filteredAmount;
                }, 0);
                branchWiseDetails.Balance = branchWiseDetails.MaturedLoanAmount - recovryAmount;
                this.excelData.push(Object.keys(branchWiseDetails));
                this.excelData.push(Object.values(branchWiseDetails));
                // this.excelService.exportAsExcelFile([...branchWiseDetails], 'branchwise');
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
        this.simpleExcelData = [];
        this.excelData = [];
    }

    getTotalAmount(data: any, filterData: string, property: string, filterProperty: string = 'branch',) {
        const totalAmount = data.reduce(function (accumulator: any, currentValue: any) {
            const filteredAmount = (currentValue?.[filterProperty] === filterData) ? currentValue?.[property] : 0;
            return accumulator + filteredAmount;
        }, 0);
        return totalAmount;
    }

    ngOnInit() { }

}
