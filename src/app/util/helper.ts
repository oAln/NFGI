import { AppConstants } from "./app.constant";
import { LoanData } from "./loan-data.model";

export function getIntererstAmount(member: any) {
  const loanData: LoanData = {
    loanTerm: 0,
    maturedAmount: 0,
    lateFees: 0,
    interestRate: 0,
    loanDays: 0
  }
  if (member?.loanId && member?.loanStartDate) {
    const loanDays = getDayDiff(member?.loanStartDate);
    const { maturedAmount, lateFees, loanTerm, interestRate } = getInterestData(member?.loanAmount, loanDays);
    loanData.loanTerm = loanTerm;
    loanData.lateFees = lateFees;
    loanData.interestRate = interestRate;
    loanData.loanDays = loanDays;
    loanData.maturedAmount = maturedAmount;
  }

  return loanData;

}

function getDayDiff(fromDate: any) {
  const currentDate = new Date();
  const givenDate = new Date(fromDate);
  const diffDate = currentDate.getTime() - givenDate.getTime();
  return Math.round(diffDate / (1000 * 60 * 60 * 24));
}

function getInterestData(amount: number, loanDays: number) {
  let maturedAmount = 0;
  let lateFees = 0;
  let interestRate = 1.05;
  let loanTerm = 30;
  if (loanDays <= 35) {
    loanTerm = 30;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[0]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[0].rate + lateFees;
  } else if (loanDays > 35 && loanDays <= 65) {
    loanTerm = 60;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[1]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[1].rate + lateFees;
  } else if (loanDays > 65 && loanDays <= 95) {
    loanTerm = 90;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[2]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[2].rate + lateFees;
  } else if (loanDays > 95 && loanDays <= 125) {
    loanTerm = 120;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[3]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[3].rate + lateFees;
  } else if (loanDays > 125 && loanDays <= 155) {
    loanTerm = 150;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[4]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[4].rate + lateFees;
  } else if (loanDays > 155 && loanDays <= 185) {
    loanTerm = 180;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[5]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[5].rate + lateFees;
  } else {
    loanTerm = 180;
    lateFees = (loanDays > loanTerm) ? (loanDays - loanTerm) * 16.67 : 0;
    interestRate = AppConstants.loanTerms[5]?.rate;
    maturedAmount = amount * AppConstants.loanTerms[5].rate + lateFees;
  }

  return { loanTerm, lateFees, interestRate, maturedAmount };

}
