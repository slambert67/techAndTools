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
}
