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
    
    public static interestData = [{
        loanTerm: 30,
        maturedAmount: 30,
        lateFees: 16.67,
        interestRate: 1.05,
        loanDays: 0,
        startDate: 21/12/2023
    }];

}

// late fees applicable if loan term is 60 days