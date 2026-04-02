import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MyClientService {
  
  private timer: NodeJS.Timeout | null = null;
  private readonly INTERVAL_MS = 50;            // How often to fire requests (arrival rate)
  private readonly PAUSE_MS = 5000;             // How long to pause after failed request 


  // create axios connection - abort request if no response within 10 seconds
  private readonly testServerConnection = axios.create({timeout: 10000});


  /*
    Summary
    -------
    Initiates the sending of HTTP requests at a defined interval 
  */
  private startRequesting() {

    if (this.timer) return; // already running - do nothing

    this.timer = setInterval(() => {
      this.sendRequest();

    }, this.INTERVAL_MS);
  }


  /*
    Summary
    -------
    Clears an interval timer and stops sending HTTP requests
    Invoked when a HTTP request has failed and a pause is required
  */
  private stopRequesting() {
    if (!this.timer) return;

    clearInterval(this.timer);
    this.timer = null;
  }


  /*
    Summary
    -------
    Issues a HTTP GET request to the my-server app
    If an eror is encountered:
      - the interval timer is cancelled
      - a new timer is initiated after a suitable pause
  */
  private async sendRequest() {

    try {
      console.log('sending http request');
      let response = await this.testServerConnection.get('http://localhost:3001');
      console.log('Process successful response');
    } catch (err) {

      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        console.error(`HTTP error status=${status}`);
      } else {
        console.error(`[Unexpected error`, err);
      }

      if (this.timer) {
        console.log('Error detected — pausing load...');
        this.stopRequesting();

        setTimeout(() => {
          console.log('Resuming load...');
          this.startRequesting();
        }, this.PAUSE_MS);
      }
    } 
  }


  /*
    Summary
    -------
    Designed to flood a server that implements throttling and concurrency control
  */
  async floodServer(): Promise<string> {
    this.startRequesting();
    return 'flooding initiated';
  }
}