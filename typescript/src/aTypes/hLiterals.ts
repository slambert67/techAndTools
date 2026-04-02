// Restrict values precisely.
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Randoms = 'text' | 10 | false;
let x: Randoms;

// allowed
x = 'text';
x = 10;
x = false;

// not allowed
// x = 'xxx';