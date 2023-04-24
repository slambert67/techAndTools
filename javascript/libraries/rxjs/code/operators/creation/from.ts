/*
Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object
Returns an Observable
Converts almost anything to an Observable
 */
import { from } from 'rxjs';

const array = [10, 20, 30];
const result = from(array);

result.subscribe(x => console.log(x));
