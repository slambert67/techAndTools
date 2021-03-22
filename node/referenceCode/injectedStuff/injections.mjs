// ES6 module

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// import.meta property is the only value injected into ES6 moduled
// url is only field and is the url from which the currently executing module was loaded
console.log(`import.meta.url: ${import.meta.url}`);

const __filename = fileURLToPath(import.meta.url);
console.log(`filename: ${__filename}`);

const __dirname = dirname(__filename);
console.log(`directory: ${__dirname}`);

