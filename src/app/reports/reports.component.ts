import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import * as XLSX from 'xlsx';
import { getDayDiff, getIntererstAmount } from '../util/helper';
import { AppConstants } from '../util/app.constant';
import { ExcelService } from '../services/excel.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { formatDate } from '@angular/common';

@Component({
    templateUrl: 'reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
    monthData: string[] = [];
    totalYears: any;
    totalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    branchReportBranch = '';
    branchReportMonth = '';
    branchReportYear: any;
    monthReportBranch = '';
    monthReportMonth = '';
    monthReportYear: any;
    colReportBranch = '';
    colReportMonth = '';
    colReportYear: any;
    branchData: any;
    selectedLoanDuration = 30;
    loanDurationData = [30, 60, 90, 120, 150, 180];
    memberData: any = [];
    simpleExcelData: any = [];
    collectionExcelData: any = [];
    excelData: any = [];

    constructor(private http: HTTPService, private excelService: ExcelService) {
        this.getMemberData();
        const currentDate = new Date();
        this.monthData = this.totalMonths.slice(0, currentDate.getMonth() + 1);
        this.branchReportMonth = this.totalMonths[currentDate.getMonth()];
        this.monthReportMonth = this.totalMonths[currentDate.getMonth()];
        this.colReportMonth = this.totalMonths[currentDate.getMonth()];
        this.branchReportYear = new Date().getFullYear();
        this.monthReportYear = new Date().getFullYear();
        this.colReportYear = new Date().getFullYear();
    }

    onBranchReportBranch(selectedBranch: any) {
        console.log('onBranchReportBranch', selectedBranch);
    }

    onBranchReportMonthSelect(selectedMonth: any) {
        console.log('onBranchReportMonthSelect', selectedMonth);
    }

    onBranchReportYearSelect(selectedYear: any) {
        console.log('onBranchReportYearSelect', selectedYear);
    }

    onColReportBranchSelect(selectedBranch: any) {
        console.log('onColReportBranchSelect', selectedBranch);
    }

    onColReportMonthSelect(selectedMonth: any) {
        console.log('onColReportMonthSelect', selectedMonth);
    }

    onColReportYearSelect(selectedYear: any) {
        console.log('onColReportYearSelect', selectedYear);
    }

    onMonthReportBranchSelect(selectedBranch: any) {
        console.log('onMonthReportBranchSelect', selectedBranch);
    }

    onMonthReportMonthSelect(selectedMonth: any) {
        console.log('onMonthReportMonthSelect', selectedMonth);
    }

    onMonthReportYearSelect(selectedYear: any) {
        console.log('onMonthReportYearSelect', selectedYear);
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
            memberDetails['repayments'] = loanData?.repayments;
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
                this.totalYears = this.memberData.reduce((acc: any, data: any) => {
                    if (!acc.includes(new Date(data.loanStartDate).getFullYear())) {
                        acc.push(new Date(data.loanStartDate).getFullYear());
                    }
                    return acc;
                }, []);
                this.branchReportBranch = this.branchData?.length ? this.branchData[0] : "";
                this.monthReportBranch = this.branchData?.length ? this.branchData[0] : "";
                this.colReportBranch = this.branchData?.length ? this.branchData[0] : "";
                this.memberData.sort((a: any, b: any) => b?.id - a?.id);
            });
    }

    onLoanDurationSelect(loanDuration: any) {
        console.log('loanDuration', loanDuration);
    }

    getMemberYearData(year: any, memberDetails: any) {
        const filterMemberData = memberDetails.filter((member: any) => {
            const loanYear = new Date(member?.loanStartDate).getFullYear();
            if (member?.loanId && member?.loanStartDate && loanYear <= year) {
                return member;
            }
        })
        return filterMemberData;
    }

    // Filter data month wise
    getMemberMonthData(month: string, memberDetails: any) {
        const selectedMonthNumber = this.totalMonths.indexOf(month);
        const filterMemberData = memberDetails.filter((member: any) => {
            const loanDate = new Date(member?.loanStartDate).getMonth();
            if (member?.loanId && member?.loanStartDate && loanDate <= selectedMonthNumber) {
                return member;
            }
        })
        return filterMemberData;
    }

    getMemberLoanData(loanId: string, memberDetails: any) {
        const filterMemberData = memberDetails.filter((member: any) => {
            if (member?.loanId == loanId) {
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
        let totalCollectedAmount = 0;
        simpleExcelProperties.map((property: any) => {
            if (property.key == 'loanDuration') {
                obj[property.header] = loanDays;
            } else if (property.key == 'index') {
                obj[property.header] = index + 1;
            } else if (property.key == 'loanStartDate') {
                obj[property.header] = formatDate(member[property.key], 'dd/MM/yyyy', 'en');;
            } else if (member?.[property.key]) {
                obj[property.header] = member[property.key];
            } else {
                switch (property.key) {
                    case 'maturedAmount30':
                        obj[property.header] = (member?.loanAmount * 1.05 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'maturedAmount60':
                        obj[property.header] = (member?.loanAmount * 1.1 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'maturedAmount90':
                        obj[property.header] = (member?.loanAmount * 1.15 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'maturedAmount120':
                        obj[property.header] = (member?.loanAmount * 1.2 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'maturedAmount150':
                        obj[property.header] = (member?.loanAmount * 1.25 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'maturedAmount180':
                        lateFees = (loanDays > 180) ? (loanDays - 180) * 16.67 : 0;
                        obj[property.header] = (member?.loanAmount * 1.3 + lateFees)?.toFixed(2) || 0;
                        break;
                    case 'term':
                    case 'lateFees':
                        {
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
                                obj[property.header] = lateFees || 0;
                            } else {
                                obj[property.header] = loanTerm;
                            }
                            break;
                        }
                    case 'lastMonthRecovery':
                        {
                            const lastMonth = new Date().getMonth() - 1;
                            const lastMonthRecovery = member?.repayments.reduce(function (accumulator: any, currentValue: any) {
                                const filteredAmount = (new Date(currentValue.paymentDate).getMonth() == lastMonth) ? (currentValue?.amountPaid + currentValue?.lateFees) : 0;
                                return accumulator + filteredAmount;
                            }, 0);
                            obj[property.header] = lastMonthRecovery?.toFixed(2) || 0;
                            break;
                        }
                    case 'totalCollectedAmount':
                        {
                            const currentMonth = new Date().getMonth();
                            const totalAmount = this.memberData.reduce(function (accumulator: any, currentValue: any) {
                                const filteredAmount = (new Date(currentValue.paymentDate).getMonth() == currentMonth) ? currentValue?.collectionAmount : 0;
                                return accumulator + filteredAmount;
                            }, 0);
                            obj[property.header] = totalAmount?.toFixed(2) || 0;
                            break;
                        }
                    case 'finalCollection':
                        totalCollectedAmount = this.memberData.reduce(function (accumulator: any, currentValue: any) {
                            const filteredAmount = (currentValue?.loanId === member?.loanId) ? currentValue?.collectionAmount : 0;
                            return accumulator + filteredAmount;
                        }, 0);
                        obj[property.header] = totalCollectedAmount?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount30':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[5].header])?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount60':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[6].header])?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount90':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[7].header])?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount120':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[8].header])?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount150':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[9].header])?.toFixed(2) || 0;
                        break;
                    case 'remainingAmount180':
                        obj[property.header] = (totalCollectedAmount - obj[simpleExcelProperties[10].header])?.toFixed(2) || 0;
                        break;
                    case 'totalAmount':
                        {
                            const currentMonth = new Date().getMonth();
                            const recovery = member?.repayments.reduce(function (accumulator: any, currentValue: any) {
                                const filteredAmount = (new Date(currentValue.paymentDate).getMonth() == currentMonth) ? currentValue?.amountPaid : 0;
                                return accumulator + filteredAmount;
                            }, 0);
                            obj[property.header] = recovery?.toFixed(2) || 0;
                            break;
                        }
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
            if (member?.loanId && member?.branch == selectedBranch) {
                return member;
            }
        })
        return filterMemberData;
    }

    generateReport(reportType?: string): void {
        let filteredYearMemberData;
        let filteredMonthMemberData;
        let filteredBranchMemberDetails;
        let branchName = '';
        let month = '';
        let year = new Date().getFullYear();
        switch (reportType) {
            case 'simple':
                {
                    branchName = this.monthReportBranch;
                    month = this.monthReportMonth;
                    year = this.monthReportYear;
                    filteredYearMemberData = this.getMemberYearData(year, this.memberData);
                    filteredMonthMemberData = this.getMemberMonthData(month, filteredYearMemberData);
                    filteredBranchMemberDetails = this.getMemberBranchWiseData(branchName, filteredMonthMemberData);
                    filteredBranchMemberDetails.forEach((member: any, index: any) => {
                        this.getMemberExcelData(member, index);
                    });
                    this.excelData.push(Object.keys(this.simpleExcelData[0]));
                    this.simpleExcelData.forEach((data: any) => {
                        if (Object.keys(this.simpleExcelData[0])?.length == Object.values(data)?.length) {
                            this.excelData.push(Object.values(data));
                        }
                    });
                    break;
                }

            case 'branchwise':
                {
                    const branchWiseDetails: any = {
                        Branch: '',
                        LoanAmount: 0,
                        MaturedLoanAmount: 0,
                        Installments: 0,
                        Recovery: 0,
                        Balance: 0
                    };
                    branchName = this.branchReportBranch;
                    month = this.branchReportMonth;
                    year = this.branchReportYear;
                    filteredYearMemberData = this.getMemberYearData(year, this.memberData);
                    filteredMonthMemberData = this.getMemberMonthData(month, filteredYearMemberData);
                    filteredBranchMemberDetails = this.getMemberBranchWiseData(branchName, filteredMonthMemberData);
                    const defaultLoanTerms = AppConstants.loanTerms;
                    const loanterm = defaultLoanTerms.find((termData: any) => termData.term === this.selectedLoanDuration || {})?.term;
                    branchWiseDetails.Branch = this.branchReportBranch;
                    branchWiseDetails.LoanAmount = this.getTotal(filteredBranchMemberDetails, 'loanAmount');
                    branchWiseDetails.Installments = this.getTotal(filteredBranchMemberDetails, 'installment');
                    branchWiseDetails.MaturedLoanAmount = filteredBranchMemberDetails.reduce(function (accumulator: any, currentValue: any) {
                        const filteredAmount = (currentValue?.loanData?.loanTerm == loanterm) ? currentValue?.loanData?.maturedAmount : 0;
                        return accumulator + filteredAmount;
                    }, 0);
                    branchWiseDetails.Recovery = this.getTotal(filteredBranchMemberDetails, 'collectionAmount');
                    branchWiseDetails.Balance = branchWiseDetails.MaturedLoanAmount - branchWiseDetails.Recovery;
                    this.excelData.push(Object.keys(branchWiseDetails));
                    this.excelData.push(Object.values(branchWiseDetails));
                    break;
                }

            case 'collection':
                {
                    branchName = this.colReportBranch;
                    month = this.colReportMonth;
                    year = this.colReportYear;
                    filteredYearMemberData = this.getMemberYearData(year, this.memberData);
                    filteredMonthMemberData = this.getMemberMonthData(month, filteredYearMemberData);
                    filteredBranchMemberDetails = this.getMemberBranchWiseData(branchName, filteredMonthMemberData);
                    filteredBranchMemberDetails.forEach((member: any, index: any) => {
                        this.getMemberCollectionExcelData(member, index);
                    });
                    this.excelData.push(Object.keys(this.collectionExcelData[0]));
                    this.collectionExcelData.forEach((data: any) => {
                        if (Object.keys(this.collectionExcelData[0])?.length == Object.values(data)?.length) {
                            this.excelData.push(Object.values(data));
                        }
                    });
                    break;
                }

            default:
                break;
        }

        /* generate worksheet */
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData);

        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        /* save to file */
        XLSX.writeFile(wb, `${branchName}_${month}_${year}.xlsx`);
        this.simpleExcelData = [];
        this.collectionExcelData = [];
        this.excelData = [];
    }

    // getCollectionData(filteredBranchMemberDetails: any) {
    //     const uniqueMemberData = filteredBranchMemberDetails.filter((member: any, i: any, arr: any) =>
    //         arr.findIndex((arrMember: any) => (arrMember?.id === member?.id)) === i
    //     );

    //     if (uniqueMemberData?.length && uniqueMemberData[0].loans?.length) {
    //         uniqueMemberData[0].loans.forEach((data: any) => {
    //             if (data?.repayments?.length) {
    //                 data?.repayments.forEach((member: any, index: any) => {
    //                     this.getMemberCollectionExcelData(data, index);
    //                 });
    //             }
    //         })
    //     }

    // }

    getTotal(members: any, property: string) {
        const totalAmount = members.reduce(function (accumulator: any, currentValue: any) {
            const filteredAmount = currentValue?.[property] ? parseInt(currentValue?.[property]) : 0;
            return accumulator + filteredAmount;
        }, 0);
        return totalAmount;
    }

    generatePDF() {
        const updatedLoanData = this.memberData;
        updatedLoanData.map((member: any) => {
            member['loanData'] = getIntererstAmount(member, 180);
        });
        const filteredMemberData = this.getMemberMonthData(this.monthReportMonth, updatedLoanData);
        const filteredBranchMemberDetails = this.getMemberBranchWiseData(this.monthReportBranch, filteredMemberData);
        // Create a new PDF document.
        const doc = new jsPDF();
        // Add content to the PDF.
        doc.setFontSize(16);
        doc.text(`LOAN PAID TO MEMBERS PLACEWISE DETAILS - ${'and'}`, 10, 10);
        doc.setFontSize(12);

        const totalBranchWiseDetails = {
            total: 'Total',
            totalLoanAmount: 0,
            totalMaturedLoanAmount: 0,
            totalInstallment: 0,
            totalRecovery: 0,
            totalBalance: 0
        };

        // Create a table using `jspdf-autotable`.
        const headers = [['BRANCH', 'LOAN AMOUNT', 'MATURED LOAN AMOUNT - 180 DAYS', 'INSTALLMENTS', 'RECOVERY', 'BALANCE - 180 DAYS']];
        const data: any = [];
        filteredBranchMemberDetails.forEach((membeData: any) => {
            const branchWiseDetails = {
                branch: '',
                loanAmount: 0,
                maturedLoanAmount: 0,
                installment: 0,
                recovery: 0,
                balance: 0
            };
            branchWiseDetails.branch = membeData?.branch;
            branchWiseDetails.loanAmount = membeData?.loanAmount || 0;
            branchWiseDetails.maturedLoanAmount = membeData?.loanData?.maturedAmount || 0;
            branchWiseDetails.installment = membeData?.installment || 0;
            branchWiseDetails.recovery = membeData?.collectionAmount || 0;
            branchWiseDetails.balance = (membeData?.loanData?.maturedAmount || 0) - (membeData?.collectionAmount || 0);
            data.push(Object.values(branchWiseDetails));
            totalBranchWiseDetails.totalLoanAmount = totalBranchWiseDetails.totalLoanAmount + branchWiseDetails.loanAmount;
            totalBranchWiseDetails.totalMaturedLoanAmount = totalBranchWiseDetails.totalMaturedLoanAmount + branchWiseDetails.maturedLoanAmount;
            totalBranchWiseDetails.totalInstallment = totalBranchWiseDetails.totalInstallment + branchWiseDetails.installment;
            totalBranchWiseDetails.totalRecovery = totalBranchWiseDetails.totalRecovery + branchWiseDetails.recovery;
            totalBranchWiseDetails.totalBalance = totalBranchWiseDetails.totalBalance + branchWiseDetails.balance;
        });

        data.push(Object.values(totalBranchWiseDetails));

        autoTable(doc, {
            head: headers,
            body: data,
            startY: 30, // Adjust the `startY` position as needed.
        });

        // Save the PDF.
        doc.save('table.pdf');
    }

}
