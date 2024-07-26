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
            header: 'Sr No.'
        },
        {
            key: 'loanStartDate',
            header: 'Loan Passed Date'
        },
        {
            key: 'memberId',
            header: 'Memebership Id'
        },
        {
            key: 'firstName',
            header: 'Member Name'
        },
        {
            key: 'loanAmount',
            header: 'Loan Amount'
        },
        {
            key: 'maturedAmount30',
            header: 'Matured Loan Aamount With 30 Days Profit'
        },
        {
            key: 'maturedAmount60',
            header: 'Matured Loan Aamount With 60 Days Profit'
        },
        {
            key: 'maturedAmount90',
            header: 'Matured Loan Aamount With 90 Days Profit'
        },
        {
            key: 'maturedAmount120',
            header: 'Matured Loan Aamount With 120 Days Profit'
        },
        {
            key: 'maturedAmount150',
            header: 'Matured Loan Aamount With 150 Days Profit'
        },
        {
            key: 'maturedAmount180',
            header: 'Matured Loan Aamount With 180 Days Profit'
        },
        {
            key: 'installment',
            header: 'Installment'
        },
        {
            key: 'collectionAmount',
            header: 'Recovery Amount Previous Month'
        },
        {
            key: 'totalCollectedamount',
            header: 'Total Collected Bal of this  Month (Recovery + Closing Bal)'
        }, {
            key: 'remainingAmount30',
            header: '30 Days Remaining'
        },
        {
            key: 'remainingAmount60',
            header: '60 Days Remaining'
        },
        {
            key: 'remainingAmount90',
            header: '90 Days Remaining'
        },
        {
            key: 'remainingAmount120',
            header: '120 Days Remaining'
        },
        {
            key: 'remainingAmount150',
            header: '150 Days Remaining'
        },
        {
            key: 'remainingAmount180',
            header: '180 Days Remaining'
        },
        {
            key: 'loanDuration',
            header: 'Loan Duration (Days)'
        },
        {
            key: 'paymentDays',    // default props
            header: 'Payment Days'
        },
        {
            key: 'term',
            header: 'Applicable Term'
        },
        {
            key: 'loanOverdue',  // check with Kaustubh
            header: 'Loan Overdue (Days)'
        },
        {
            key: 'lateFees',
            header: 'Late Fees'
        },
        {
            key: 'totalAmount',
            header: 'Total Amount (Including Late Fees)'
        },
        {
            key: 'finalCollection',   // check with Kaustubh
            header: 'Final Collection  '
        },
        {
            key: 'accountStatus',
            header: 'Member Status'
        }
    ]

    public static accountStatementProperties = {
        index: '',
        loanStartDate: ''
    }

}
