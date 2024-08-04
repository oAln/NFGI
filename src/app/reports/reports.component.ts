import { Component } from '@angular/core';
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
export class ReportsComponent {
    monthData: string[] = [];
    totalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    selectedMonth = '';
    selectedBranch = '';
    branchData: any;
    selectedLoanDuration = 30;
    loanDurationData = [30, 60, 90, 120, 150, 180]
    memberData: any = [];
    simpleExcelData: any = [];
    collectionExcelData: any = [];
    excelData: any = [];

    constructor(private http: HTTPService, private excelService: ExcelService) {
        this.getMemberData();
        const currentDate = new Date();
        this.monthData = this.totalMonths.slice(0, currentDate.getMonth() + 1);
        this.selectedMonth = this.totalMonths[currentDate.getMonth()];
    }
    
    onBranchSelect(selectedBranch: any) {
        console.log('selectedBranch', selectedBranch);
    }

    onMonthSelect(selectedMonth: any) {
        console.log('selectedMonth', selectedMonth);
    }

    updateMemberData(member: any) {
        member?.loans.sort((a: any, b: any) => b?.id - a?.id);
        member?.loans.map((loanData: any) => {
            const memberDetails = { ...member }
            memberDetails['loanAmount'] = loanData?.amount;
            memberDetails['installment'] = loanData?.installment;
            memberDetails['loanId'] = loanData?.id;
            memberDetails['loanStartDate'] = loanData?.issuedAt;
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
                memberDetails?.forEach((member: any) => {
                    if (member?.loans?.length) {
                        this.updateMemberData(member);
                    }
                    else {
                        this.memberData.push(member);
                    }
                });
                this.memberData.map((member: any) => {
                    member['loanData'] = getIntererstAmount(member);
                });
                this.branchData = this.memberData.reduce((acc: any, data: any) => {
                    if (!acc.includes(data.branch)) {
                        acc.push(data.branch);
                    }
                    return acc;
                }, []);
                this.selectedBranch = this.branchData?.length ? this.branchData[0] : "";
                this.memberData.sort((a: any, b: any) => b?.id - a?.id);
            });
    }

    onLoanDurationSelect(loanDuration: any) {
        console.log('loanDuration', loanDuration);
    }

    // Filter data month wise
    getMemberMonthData(month: string) {
        const selectedMonthNumber = this.totalMonths.indexOf(this.selectedMonth);
        const filterMemberData = this.memberData.filter((member: any) => {
            const loanDate = new Date(member?.loanStartDate).getMonth();
            if ((member?.accountStatus != 'Closed') && member?.loanId && member?.loanStartDate && loanDate == selectedMonthNumber) {
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
                        obj[property.header] = (member?.loanAmount * 1.05 + lateFees) || 0;
                        break;
                    case 'maturedAmount60':
                        lateFees = (loanDays > 60) ? (loanDays - 60) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.1 + lateFees) || 0;
                        break;
                    case 'maturedAmount90':
                        lateFees = (loanDays > 90) ? (loanDays - 90) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.15 + lateFees) || 0;
                        break;
                    case 'maturedAmount120':
                        lateFees = (loanDays > 120) ? (loanDays - 120) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.2 + lateFees) || 0;
                        break;
                    case 'maturedAmount150':
                        lateFees = (loanDays > 150) ? (loanDays - 150) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.25 + lateFees) || 0;
                        break;
                    case 'maturedAmount180':
                        lateFees = (loanDays > 180) ? (loanDays - 180) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.3 + lateFees) || 0;
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
                            obj[property.header] = lateFees || 0;
                        } else {
                            obj[property.header] = loanTerm;
                        }
                        break;
                    case 'totalCollectedamount':
                        totalCollectedamount = this.memberData.reduce(function (accumulator: any, currentValue: any) {
                            const filteredAmount = (currentValue?.loanId === member?.loanId) ? currentValue?.collectionAmount : 0;
                            return accumulator + filteredAmount;
                        }, 0);
                        obj[property.header] = totalCollectedamount || 0;
                        break;
                    case 'remainingAmount30':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[5].header]) || 0;
                        break;
                    case 'remainingAmount60':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[6].header]) || 0;
                        break;
                    case 'remainingAmount90':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[7].header]) || 0;
                        break;
                    case 'remainingAmount120':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[8].header]) || 0;
                        break;
                    case 'remainingAmount150':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[9].header] || 0);
                        break;
                    case 'remainingAmount180':
                        obj[property.header] = (totalCollectedamount - obj[simpleExcelProperties[10].header]) || 0;
                        break;
                    case 'totalAmount':
                        const appliedLoanTerm = obj[simpleExcelProperties[22].header];
                        const defaultLoanTerms = AppConstants.loanTerms;
                        const loanInterest = defaultLoanTerms.find((loanTerm: any) => loanTerm.term === appliedLoanTerm || {})?.rate || 1.05;
                        obj[property.header] = (member?.loanAmount * loanInterest + obj[simpleExcelProperties[24].header]) || 0;
                        break;
                    case 'loanOverdue':
                        obj[property.header] = (member?.loanAmount + obj[simpleExcelProperties[24].header]) || 0;
                        break;

                    default:
                        break;
                }
            }
        })
        this.simpleExcelData.push(obj);
    }

    getMemberCollectionExcelData(member: any, index: any) {
        const collectionExcelProperties = AppConstants.accountCollectionStatement;
        const obj: any = {};
        collectionExcelProperties.map((property: any) => {
            if (property.key == 'index') {
                obj[property.header] = index + 1;
            } else if (property.key == 'lateFees') {
                const lateFees = member?.repayments.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = currentValue?.lateFees;
                    return accumulator + filteredAmount;
                }, 0);
                obj[property.header] = lateFees || 0;
            } else if (member?.[property.key]) {
                obj[property.header] = member[property.key];
            } else {
                const amountPaid = member?.repayments.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = (new Date(currentValue.paymentDate).getDate() == property.key) ? currentValue?.amountPaid : 0;
                    return accumulator + filteredAmount;
                }, 0);

                obj[property.header] = amountPaid || 0;
            }
        })

        this.collectionExcelData.push(obj);
    }

    getMemberBranchWiseData(selectedBranch: string, memberDetails: any) {
        const filterMemberData = memberDetails.filter((member: any) => {
            if ((member?.accountStatus != 'Closed') && member?.loanId && member?.branch == selectedBranch) {
                return member;
            }
        })
        return filterMemberData;
    }

    generateReport(reportType?: string): void {
        const filteredMemberData = this.getMemberMonthData(this.selectedMonth);
        const filteredBranchMemberDetails = this.getMemberBranchWiseData(this.selectedBranch, filteredMemberData);
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
                    Branch: '',
                    LoanAmount: 0,
                    MaturedLoanAmount: 0,
                    Installments: 0,
                    Recovey: 0,
                    Balance: 0
                };
                const branch = this.selectedBranch;
                const defaultLoanTerms = AppConstants.loanTerms;
                const loanterm = defaultLoanTerms.find((termData: any) => termData.term === this.selectedLoanDuration || {})?.term;
                branchWiseDetails.Branch = this.selectedBranch;
                branchWiseDetails.LoanAmount = this.getTotalAmount(filteredBranchMemberDetails, branch, 'loanAmount');
                branchWiseDetails.Installments = this.getTotalAmount(filteredBranchMemberDetails, branch, 'installment');
                branchWiseDetails.MaturedLoanAmount = filteredBranchMemberDetails.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = (currentValue?.loanData?.loanTerm == loanterm) ? currentValue?.loanData?.maturedAmount : 0;
                    return accumulator + filteredAmount;
                }, 0);
                branchWiseDetails.Recovey = this.getTotalAmount(filteredBranchMemberDetails, branch, 'collectionAmount');
                const recovryAmount = filteredBranchMemberDetails.reduce(function (accumulator: any, currentValue: any) {
                    const filteredAmount = (currentValue?.loanData?.loanTerm == loanterm) ? currentValue?.collectionAmount : 0;
                    return accumulator + filteredAmount;
                }, 0);
                branchWiseDetails.Balance = branchWiseDetails.MaturedLoanAmount - recovryAmount;
                this.excelData.push(Object.keys(branchWiseDetails));
                this.excelData.push(Object.values(branchWiseDetails));
                break;

            case 'collection':
                this.getCollectionData(filteredBranchMemberDetails);
                this.excelData.push(Object.keys(this.collectionExcelData[0]));
                this.collectionExcelData.forEach((data: any) => {
                    if (Object.keys(this.collectionExcelData[0])?.length == Object.values(data)?.length) {
                        this.excelData.push(Object.values(data));
                    }
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
        this.simpleExcelData = [];
        this.collectionExcelData = [];
        this.excelData = [];
    }

    getCollectionData(filteredBranchMemberDetails: any) {
        const uniqueMemberData = filteredBranchMemberDetails.filter((member: any, i: any, arr: any) =>
            arr.findIndex((arrMember: any) => (arrMember?.id === member?.id)) === i
        );

        if (uniqueMemberData?.length && uniqueMemberData[0]?.repayments?.length) {
            uniqueMemberData.forEach((member: any, index: any) => {
                this.getMemberCollectionExcelData(member, index);
            });
        }
        
    }

    getTotalAmount(data: any, filterData: string, property: string, filterProperty: string = 'branch',) {
        const totalAmount = data.reduce(function (accumulator: any, currentValue: any) {
            const filteredAmount = (currentValue?.[filterProperty] === filterData) ? currentValue?.[property] : 0;
            return accumulator + filteredAmount;
        }, 0);
        return totalAmount;
    }

}
