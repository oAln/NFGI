export class AppConstants {
    public static loanTerms = [{
        term: 30,
        rate: 1.05
    },
    {
        term: 60,
        rate: 1.1
    },
    {
        term: 90,
        rate: 1.15
    },
    {
        term: 120,
        rate: 1.2
    },
    {
        term: 150,
        rate: 1.25
    },
    {
        term: 180,
        rate: 1.3
    }];

    public static accountStatementHeaders = [
        {
            key: 'index',
            header: 'Sr No.',
            value: ''
        },
        {
            key: 'loanStartDate',
            header: 'Loan Passed Date',
            value: ''
        },
        {
            key: 'memberId',
            header: 'Memebership Id',
            value: ''
        },
        {
            key: 'firstName',
            header: 'Member Name',
            value: ''
        },
        {
            key: 'loanAmount',
            header: 'Loan Amount',
            value: ''
        }, {
            key: 'maturedAmount30',
            header: 'Matured Loan Aamount With 30 Days Profit',
            value: ''
        },
        {
            key: 'maturedAmount60',
            header: 'Matured Loan Aamount With 60 Days Profit',
            value: ''
        },
        {
            key: 'maturedAmount90',
            header: 'Matured Loan Aamount With 90 Days Profit',
            value: ''
        },
        {
            key: 'maturedAmount120',
            header: 'Matured Loan Aamount With 120 Days Profit',
            value: ''
        },
        {
            key: 'maturedAmount150',
            header: 'Matured Loan Aamount With 150 Days Profit',
            value: ''
        },
        {
            key: 'maturedAmount180',
            header: 'Matured Loan Aamount With 180 Days Profit',
            value: ''
        },
        {
            key: 'installment',
            header: 'Installment',
            value: ''
        },
        {
            key: 'recoveryAmount',
            header: 'Recovery Amount Previous Month',
            value: ''
        },
        {
            key: 'totalCollectedamount',
            header: 'Total Collected Bal of this  Month (Recovery + Closing Bal)',
            value: ''
        }, {
            key: 'remainingAmount30',
            header: '30 Days Remaining',
            value: ''
        },
        {
            key: 'remainingAmount60',
            header: '60 Days Remaining',
            value: ''
        },
        {
            key: 'remainingAmount90',
            header: '90 Days Remaining',
            value: ''
        },
        {
            key: 'remainingAmount120',
            header: '120 Days Remaining',
            value: ''
        },
        {
            key: 'remainingAmount150',
            header: '150 Days Remaining',
            value: ''
        },
        {
            key: 'remainingAmount180',
            header: '180 Days Remaining',
            value: ''
        },
        {
            key: 'loanDuration',
            header: 'Loan Duration (Days)',
            value: ''
        },
        {
            key: 'paymentDays',
            header: 'Payment Days',
            value: ''
        },
        {
            key: 'term',
            header: 'Applicable Term',
            value: ''
        },
        {
            key: 'loanOverdue',
            header: 'Loan Overdue (Days)',
            value: ''
        },
        {
            key: 'lateFees',
            header: 'Late Fees',
            value: ''
        },
        {
            key: 'totalAmount',
            header: 'Total Amount (Including Late Fees)',
            value: ''
        },
        {
            key: 'finalCollection',
            header: 'Final Collection  ',
            value: ''
        },
        {
            key: 'accountStatus',
            header: 'Member Status',
            value: ''
        }
    ]

}
