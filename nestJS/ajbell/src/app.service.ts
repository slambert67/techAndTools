import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  private users = [
          { id: 1, name: 'Alice', status: 'active' },
          { id: 2, name: 'Bob', status: 'inactive' }
        ];

  private userDetails = [
    {
      "id": 1,
      "name": "Alice",
      "status2": "active",
      "email": "alice@example.com",
      "role": "admin",
      "words": ["oink", "squoink"],
      "lastLogin": "2026-03-01T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Bob",
      "status2": "active",
      "email": "bob@example.com",
      "role": "dogsbody",
      "words": ["occulus", "bocculus"],
      "lastLogin": "2026-03-01T10:00:00Z"
    }
  ]

  private data = [
  {
    "user": {
      "id": 987654,
      "name": { "first": "Alice", "last": "Johnson" },
      "email": null,
      "phone": "+44 20 7946 0958",
      "preferences": {
        "currency": "GBP",
        "notifications": { "email": true, "sms": null, "push": true },
        "theme": "dark"
      }
    },
    "accounts": [
      {
        "accountId": "ACC123456",
        "type": "ISA",
        "balance": 15234.56,
        "currency": "GBP",
        "transactions": [
          { "transactionId": "TX1001", "date": "2026-03-28T14:32:00Z", "description": "Deposit", "amount": 5000.0, "type": "credit" },
          { "transactionId": "TX1002", "date": "2026-03-29T10:15:00Z", "description": "Buy S&P 500 ETF", "amount": null, "type": "debit" }
        ],
        "status": "active"
      }
    ],
    "portfolioSummary": { "totalBalance": 15234.56, "assetAllocation": { "equities": 40.0, "bonds": 50.0, "cash": 10.0 }, "performance": { "1M": 1.2, "3M": 3.8, "YTD": 5.6 } },
    "alerts": [
      { "id": "ALERT100", "type": "low_balance", "message": null, "read": false, "createdAt": "2026-03-30T08:45:00Z" }
    ]
  },
  
  
  {
    "user": {
      "id": 987655,
      "name": { "first": "Bob", "last": "Smith" },
      "email": "bob.smith@example.com",
      "phone": null,
      "preferences": { "currency": "GBP", "notifications": { "email": false, "sms": true, "push": null }, "theme": "light" }
    },
    "accounts": [
      {
        "accountId": "ACC654321",
        "type": "SIPP",
        "balance": null,
        "currency": "GBP",
        "transactions": [
          { "transactionId": "TX2001", "date": "2026-02-15T12:00:00Z", "description": "Monthly Contribution", "amount": 1000.0, "type": "credit" },
          { "transactionId": "TX2002", "date": "2026-03-10T09:00:00Z", "description": "Buy UK Government Bonds", "amount": -5000.0 }
        ],
        "status": "inactive"
      }
    ],
    "portfolioSummary": { "totalBalance": null, "assetAllocation": { "equities": 60.0, "bonds": 30.0, "cash": 10.0 }, "performance": { "1M": 0.5, "3M": 2.1, "YTD": 4.0 } },
    "alerts": [
      { "id": "ALERT101", "type": "dividend", "message": "You received a dividend payment of £120", "read": true }
    ]
  },
  
  
  {
    "user": {
      "id": 987656,
      "name": { "first": "Charlie", "last": "Evans" },
      "email": "charlie.evans@example.com",
      "phone": "+44 20 7946 0961",
      "preferences": { "currency": "GBP", "notifications": { "email": null, "sms": true, "push": true }, "theme": null }
    },
    "accounts": [
      {
        "accountId": "ACC111222",
        "type": "ISA",
        "balance": 20000.0,
        "currency": "GBP",
        "transactions": [],
        "status": "active"
      }
    ],
    "portfolioSummary": { "totalBalance": 20000.0, "assetAllocation": { "equities": 50.0, "bonds": 40.0, "cash": 10.0 }, "performance": { "1M": 0.9, "3M": 2.5 } },
    "alerts": []
  },
  
  
  {
    "user": {
      "id": 987657,
      "name": { "first": "Diana", "last": "Lopez" },
      "email": null,
      "phone": "+44 20 7946 0962",
      "preferences": { "currency": "GBP", "notifications": { "email": true, "sms": true, "push": true }, "theme": "light" }
    },
    "accounts": [
      {
        "accountId": "ACC333444",
        "type": "SIPP",
        "balance": 35000.0,
        "currency": "GBP",
        "transactions": [
          { "transactionId": "TX4001", "date": "2026-01-10T09:00:00Z", "description": "Deposit", "amount": 15000.0, "type": "credit" },
          { "transactionId": "TX4002", "date": "2026-02-12T09:00:00Z", "description": "Withdraw", "amount": -500.0, "type": "debit", "meta": null }
        ],
        "status": "active"
      }
    ],
    "portfolioSummary": { "totalBalance": 35000.0, "assetAllocation": { "equities": 30.0, "bonds": 60.0, "cash": 10.0 }, "performance": { "1M": 1.5, "3M": 3.0, "YTD": 6.0 } },
    "alerts": [
      { "id": "ALERT102", "type": null, "message": "Your balance dropped below £20,000", "read": false, "createdAt": null }
    ]
  },
  
  
  {
    "user": {
      "id": 987658,
      "name": { "first": "Ethan", "last": "Brown" },
      "email": "ethan.brown@example.com",
      "phone": "+44 20 7946 0963",
      "preferences": { "currency": "GBP", "notifications": { "email": true, "sms": false, "push": null }, "theme": "dark" }
    },
    "accounts": [
      {
        "accountId": "ACC555666",
        "type": "ISA",
        "balance": 5000.0,
        "currency": "GBP",
        "transactions": [
          { "transactionId": "TX5001", "date": "2026-03-05T10:00:00Z", "description": "Deposit", "amount": null, "type": "credit" }
        ],
        "status": "active"
      },
      {
        "accountId": "ACC555667",
        "type": "ISA",
        "balance": 5000.0,
        "currency": "GBP",
        "transactions": [
          { "transactionId": "TX5001", "date": "2026-03-05T10:00:00Z", "description": "Deposit", "amount": null, "type": "credit" }
        ],
        "status": "active"
      }
    ],
    "portfolioSummary": { "totalBalance": 5000.0, "assetAllocation": { "equities": 80.0, "bonds": 10.0, "cash": 10.0 }, "performance": { "1M": 0.2, "3M": 1.0, "YTD": 1.5 } },
    "alerts": []
  }
  ];

  async getUsers() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve( this.users );
      }, 3000);
    });
  }

  /*async getUser(id:number) {

    return new Promise(resolve => {
      setTimeout(() => {
        resolve( this.userDetails.find( (user) => user.id === id) );
      }, 3000);
    });
  }*/

  async getAllUserDetails() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve( this.userDetails );
      }, 6000);
    });
  }

  async getData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve( this.data );
      }, 6000);
    });
  }
}
