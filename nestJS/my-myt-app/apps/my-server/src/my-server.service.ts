import { Injectable } from '@nestjs/common';

@Injectable()
export class MyServerService {

  async processGetRequest(): Promise<string> {
    // Simulate time consuming async processing
    await new Promise(resolve => setTimeout(resolve, 5000));
    return 'Hello from server!';
  }
}
