import { fileURLToPath } from 'url';
import { dirname } from 'path';

//console.log("Hello from TypeScript + Node");
console.log(import.meta.url);  // full path

const __filename = fileURLToPath(import.meta.url);
console.log(`filename: ${__filename}`);
const __dirname = dirname(__filename);
console.log(`dirname: ${__dirname}`);

