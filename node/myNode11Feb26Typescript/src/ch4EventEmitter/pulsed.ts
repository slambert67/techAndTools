import {Pulser} from './pulser.js';

// Instantiate a Pulser object
const pulser = new Pulser();

// Handler function
pulser.on( 'pulse', () => {
    console.log(`${new Date().toISOString()} pulse received`);
});

// Initiate pulsing
pulser.start();