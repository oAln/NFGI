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
            header: 'Matured Loan Amount With 30 Days Profit'
        },
        {
            key: 'maturedAmount60',
            header: 'Matured Loan Amount With 60 Days Profit'
        },
        {
            key: 'maturedAmount90',
            header: 'Matured Loan Amount With 90 Days Profit'
        },
        {
            key: 'maturedAmount120',
            header: 'Matured Loan Amount With 120 Days Profit'
        },
        {
            key: 'maturedAmount150',
            header: 'Matured Loan Amount With 150 Days Profit'
        },
        {
            key: 'maturedAmount180',
            header: 'Matured Loan Amount With 180 Days Profit'
        },
        {
            key: 'installment',
            header: 'Installment'
        },
        {
            key: 'collectionAmount',
            header: 'Recovery Amount Previous Month' // only last month collection
        },
        {
            key: 'totalCollectedamount',
            header: 'Total Collected Bal of this  Month (Recovery + Closing Bal)' // total coll for current month
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
            key: 'loanOverdue',  // check doc
            header: 'Loan Overdue (Days)'
        },
        {
            key: 'lateFees',
            header: 'Late Fees'
        },
        {
            key: 'totalAmount',
            header: 'Total Amount (Including Late Fees)' // cuurent month collection + late fees
        },
        {
            key: 'finalCollection',   // total coll
            header: 'Final Collection'
        },
        {
            key: 'accountStatus',
            header: 'Member Status'
        }
    ]

    public static accountCollectionStatement = [
        {
            key: 'index',
            header: 'Sr No.'
        },
        {
            key: 'firstName',
            header: 'Memeber Name'
        },
        {
            key: '1',
            header: '1'
        },
        {
            key: '2',
            header: '2'
        },
        {
            key: '3',
            header: '3'
        },
        {
            key: '4',
            header: '4'
        },
        {
            key: '5',
            header: '5'
        },
        {
            key: '6',
            header: '6'
        },
        {
            key: '7',
            header: '7'
        },
        {
            key: '8',
            header: '8'
        },
        {
            key: '9',
            header: '9'
        },
        {
            key: '10',
            header: '10'
        },
        {
            key: '11',
            header: '11'
        }, {
            key: '12',
            header: '12'
        },
        {
            key: '13',
            header: '13'
        },
        {
            key: '14',
            header: '14'
        },
        {
            key: '15',
            header: '15'
        },
        {
            key: '16',
            header: '16'
        },
        {
            key: '17',
            header: '17'
        },
        {
            key: '18',
            header: '18'
        },
        {
            key: '19',    // default props
            header: '19'
        },
        {
            key: '20',
            header: '20'
        },
        {
            key: '21',  // check with Kaustubh
            header: '21'
        },
        {
            key: '22',
            header: '22'
        },
        {
            key: '23',
            header: '23'
        },
        {
            key: '24',   // check with Kaustubh
            header: '24'
        },
        {
            key: '25',
            header: '25'
        },
        {
            key: '26',
            header: '26'
        },
        {
            key: '27',
            header: '27'
        },
        {
            key: '28',
            header: '28'
        },
        {
            key: '29',    // default props
            header: '29'
        },
        {
            key: '30',
            header: '30'
        },
        {
            key: '31',  // check with Kaustubh
            header: '31'
        },
        {
            key: 'lateFees',
            header: 'Late Fees(If Applicable'
        }
    ]

}
