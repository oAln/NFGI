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
  totalCollection = 0;


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
      if (loanData?.repayments?.length) {
        console.log(loanData?.repayments);
        memberDetails['collectionAmount'] = loanData?.repayments?.reduce(function (accumulator: any, currentValue: any) {
          const filteredAmount = ((currentValue?.amountPaid || 0) + (currentValue?.lateFees || 0));
          return accumulator + filteredAmount;
        }, 0);
        memberDetails['paymentDays'] = loanData?.repayments?.length;
      };
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
          this.saveLateFees(member);
        });
        this.memberData.sort((a: any, b: any) => b?.id - a?.id);
        this.selectedBranch = this.branchData?.length ? this.branchData[0] : "";
        const filteredMemberDetails = this.getMemberBranchWiseData(this.selectedBranch, this.memberData);
        this.getBranchwiseDetails(this.selectedBranch, filteredMemberDetails);
        this.getMemberMonthWiseData(this.selectedMonth, filteredMemberDetails);
        this.newAccountDisburse = 0;
        this.oldAccountDisburse = 0;
        this.filterCardData('Daily');
      });
  }

  saveLateFees(member: any) {
    const loanData = member['loanData'];
    if (loanData?.lateFees) {
      let body: any = {};
      body['paymentDate'] = new Date();
      body['amountPaid'] = 0;
      body['status'] = 'Active';
      body['memberId'] = member?.memberId;
      body['loanId'] = member?.loanId;
      body['lateFees'] = parseInt(loanData?.lateFees);
      const apiEndPoint = 'repayments'
      this.http.create(apiEndPoint, body).subscribe(
        (data) => {
          console.log(data);
        }, (error) => {
          console.log(error);
        }
      )
    }
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
    // 120 days recovery amount 
    const recovryAmount = memberDetails.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = (currentValue?.loanData?.loanTerm == AppConstants.loanTerms[3].term) ? currentValue?.collectionAmount : 0;
      return accumulator + filteredAmount;
    }, 0);
    this.branchWiseDetails.totalBalance = (this.branchWiseDetails.totalMaturedLoanAmount - recovryAmount) || 0;
  }

  onMonthSelect(selectedMonth: any) {
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
    const currentDate = new Date();
    let dateFilter: any;
    switch (filterKey?.value || filterKey) {
      case 'Daily':
        dateFilter = new Date();
        break;
      case 'Weekly':
        dateFilter = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case 'Monthly':
        dateFilter = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case 'Yearly':
        dateFilter = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        break;

      default:
        break;
    }
    const oldDisburse: any = [];
    const newDisburse: any = [];
    this.memberData.forEach((member: any) => {
      if (member?.loans?.length > 1) {
        oldDisburse.push(member)
      } else {
        newDisburse.push(member)
      }
    })
    this.oldAccountDisburse = oldDisburse?.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = ((new Date(currentValue?.loanStartDate) > dateFilter) ? currentValue?.loanAmount : 0) || 0;
      return accumulator + filteredAmount;
    }, 0);
    this.newAccountDisburse = newDisburse?.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = ((new Date(currentValue?.loanStartDate) > dateFilter) ? currentValue?.loanAmount : 0) || 0;
      return accumulator + filteredAmount;
    }, 0);
    this.totalCollection = this.memberData?.reduce(function (accumulator: any, currentValue: any) {
      const filteredAmount = ((new Date(currentValue?.loanStartDate) > dateFilter) ? currentValue?.collectionAmount : 0) || 0;
      return accumulator + filteredAmount;
    }, 0);
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
