//const dotenv = require('dotenv');
import { default as dotenv } from 'dotenv';
dotenv.config();

const myEnvVar = process.env.MY_ENV_VAR;
console.log(`My environment variable is ${myEnvVar}`);