import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

/*
    Summary
    -------
    Protects an API with a combination of rate limiting, concurrency protection and request queuing (not yet implemented)

    Algorithm
    ---------
        Rate Limiting
        -------------
        Tokens are accrued over time which can be 'spent' on requests
        Number of tokens initialised to 30
        Tokens are accrued at a specified rate over time
        Elapsed time can be calculated between requests to determine how many tokens have accrued - never more then defined max e.g.30
        Requests have a token cost but are all defaulted to 1 in this example


        Concurrency Protection
        ----------------------
        A maximum is defined
        For each request accepted an event handler is added to the response so as to keep count of active requests i.e. concurrency

        A request is only processed if the rate limiting and concurrency checks are passed
        The client in this example code will receive an exception and wait a while before resuming


        Request Queuing
        ---------------
        Not implemented

            Place all requests in a queue
            Requests are served first-come, first-served
            Guarantees processing of request - unless queue becomes way too large
            I have implemented retry functionality on the client. See my-client.service.ts
*/


@Injectable()
export class MyServerGuard implements CanActivate {

    // constants - to be specified as config in production
    private readonly REQUEST_COST:number = 1;   // A large POST may cost more than a simple GET
    private readonly MAX_CONCURRENCY = 10;
    private readonly TOKEN_REFILL_RATE = 10;
    private readonly MAX_TOKENS = 30;


    private tokens: number = this.MAX_TOKENS;   // tokens available to 'spend' on requests
    private lastRefill: number = Date.now();    // the last time tokens were accrued based on time since last request
    private activeRequests: number = 0;         // used in concurrency control


    constructor() {}


    async canActivate(context: ExecutionContext): Promise<boolean> {

        // Update available tokens based on how many have accrued since last request was processed
        const now = Date.now();                            
        const elapsed = (now - this.lastRefill) / 1000;
        this.tokens = Math.min( this.MAX_TOKENS, this.tokens + (elapsed * this.TOKEN_REFILL_RATE) ); 

        // Update lastRefill timestamp to now for the next token accrual calculation
        this.lastRefill = now;
        
        // If we have enough tokens to cover the cost of this request and we don't exceed concurrency limit then allow this request
        if ( (this.tokens >= this.REQUEST_COST) && (this.activeRequests < this.MAX_CONCURRENCY) ) {

            // Consume the tokens and increment the active requests
            this.tokens -= this.REQUEST_COST;
            this.activeRequests++;

            // Decrement activeRequests when the response to this current request finishes
            const httpResponse = context.switchToHttp().getResponse();
            httpResponse.on('finish', () => {
                this.activeRequests--;
            });
            console.log('Allowing Request ****************************************');
            return true;
        }

        // Not enough tokens available or max concurrency exceeded - request disallowed
        console.log('Not Allowing Request ****************************************');
        return false;       
    }
}