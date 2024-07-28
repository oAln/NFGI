import { Component } from '@angular/core';
import { HTTPService } from '../services/http.service';
import { getIntererstAmount } from '../util/helper';
import { AppConstants } from '../util/app.constant';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  filteredStates: any = [];
  memberData: any = [];
  branchData: any;
  monthData: string[] = [];
  totalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
  selectedBranch = '';
  selectedMonth: any;
  branchWiseDetails = {
    totalLoanAmount: 0,
    totalMaturedLoanAmount: 0,
    totalInstallment: 0,
    totalRecovey: 0,
    totalBalance: 0,
  };
  newAccountDisburse = 0;
  oldAccountDisburse = 0;


  constructor(private http: HTTPService) {
    this.getMemberData();
    const currentDate = new Date();
    this.monthData = this.totalMonths.slice(0, currentDate.getMonth() + 1);
    this.selectedMonth = this.totalMonths[currentDate.getMonth()];
  }

  updateMemberData(member: any) {
    member?.loans.sort((a: any, b: any) => b?.id - a?.id);
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
              const filteredAmount = currentValue?.amountPaid || 0;
              return accumulator + filteredAmount;
            }, 0);
          };
          member['paymentDays'] = member?.repayments?.length;
        });
        console.log(this.memberData);

        this.branchData = this.memberData.reduce((acc: any, data: any) => {
          if (!acc.includes(data.branch)) {
            acc.push(data.branch);
          }
          return acc;
        }, []);

        this.memberData.map((member: any) => {
          if (member?.memberId == "12345") {
            member['loanStartDate'] = '04/21/2024'
          }
          member['loanData'] = getIntererstAmount(member);
        });
        console.log(this.memberData);
        this.memberData.sort((a: any, b: any) => b?.id - a?.id);
        this.selectedBranch = this.branchData?.length ? this.branchData[0] : "";
        const filteredMemberDetails = this.getMemberBranchWiseData(this.selectedBranch, this.memberData);
        this.getBranchwiseDetails(this.selectedBranch, filteredMemberDetails);
        this.getMemberMonthWiseData(this.selectedMonth, filteredMemberDetails);
        console.log(this.branchData);
        this.newAccountDisburse = 0;
        this.oldAccountDisburse = 0;

      });
  }

  getTotalAmount(members: any, filterData: string, property: string, filterProperty: string) {
    const totalAmount = members.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.[filterProperty] === filterData) ? currentValue?.[property] ? parseInt(currentValue?.[property]) : 0 : 0;
      return accumulator + filteredAmount;
    }, 0);
    return totalAmount;
  }

  onBranchSelect(selectedBranch: any) {
    const memberDetails = this.getMemberMonthWiseData(this.selectedMonth, this.memberData);
    this.getBranchwiseDetails(selectedBranch, memberDetails);
  }

  getBranchwiseDetails(selectedBranch: string, memberDetails: any) {
    this.branchWiseDetails.totalLoanAmount = this.getTotalAmount(memberDetails, selectedBranch, 'loanAmount', 'branch');
    this.branchWiseDetails.totalInstallment = this.getTotalAmount(memberDetails, selectedBranch, 'installment', 'branch');
    this.branchWiseDetails.totalMaturedLoanAmount = memberDetails.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.loanData?.loanTerm == AppConstants.loanTerms[3].term) ? currentValue?.loanData?.maturedAmount : 0;
      return accumulator + filteredAmount;
    }, 0);
    this.branchWiseDetails.totalRecovey = this.getTotalAmount(memberDetails, selectedBranch, 'collectionAmount', 'branch');
    // 120 days recovery amount 
    const recovryAmount = memberDetails.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.loanData?.loanTerm == AppConstants.loanTerms[3].term) ? currentValue?.collectionAmount : 0;
      return accumulator + filteredAmount;
    }, 0);
    this.branchWiseDetails.totalBalance = this.branchWiseDetails.totalMaturedLoanAmount - recovryAmount;
  }

  onMonthSelect(selectedMonth: any) {
    console.log('selectedMonth', selectedMonth);
    const selectedBranch = this.selectedBranch;
    const memberBranchDetails = this.getMemberBranchWiseData(selectedBranch, this.memberData);
    const memberDetails = this.getMemberMonthWiseData(selectedMonth, memberBranchDetails);
    this.branchWiseDetails.totalLoanAmount = this.getTotalAmount(memberDetails, selectedBranch, 'loanAmount', 'branch');
    this.branchWiseDetails.totalInstallment = this.getTotalAmount(memberDetails, selectedBranch, 'installment', 'branch');
    this.branchWiseDetails.totalMaturedLoanAmount = memberDetails.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.loanData?.loanTerm == AppConstants.loanTerms[3].term) ? currentValue?.loanData?.maturedAmount : 0;
      return accumulator + filteredAmount;
    }, 0);
    this.branchWiseDetails.totalRecovey = this.getTotalAmount(memberDetails, selectedBranch, 'collectionAmount', 'branch');
    // 120 days recovery amount 
    const recovryAmount = memberDetails.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.loanData?.loanTerm == AppConstants.loanTerms[3].term) ? currentValue?.collectionAmount : 0;
      return accumulator + filteredAmount;
    }, 0);
    this.branchWiseDetails.totalBalance = this.branchWiseDetails.totalMaturedLoanAmount - recovryAmount;
  }

  filterCardData(filterKey: any) {
    console.log('filterKey', filterKey?.value);
  }

  getMemberMonthWiseData(month: string, memberDetails: any) {
    const selectedMonthNumber = this.totalMonths.indexOf(this.selectedMonth || month);
    const filterMemberData = memberDetails.filter((member: any) => {
      const loanDate = new Date(member?.loanStartDate).getMonth()
      if ((member?.accountStatus != 'Closed') && member?.loanId && member?.loanStartDate && loanDate == selectedMonthNumber) {
        return member;
      }
    })
    return filterMemberData;
  }

  getMemberBranchWiseData(selectedBranch: string, memberDetails: any) {
    const filterMemberData = memberDetails.filter((member: any) => {
      if ((member?.accountStatus != 'Closed') && member?.loanId && member?.branch == selectedBranch) {
        return member;
      }
    })
    return filterMemberData;
  }
}
