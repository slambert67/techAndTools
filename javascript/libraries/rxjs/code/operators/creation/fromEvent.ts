/*
Creates an Observable that emits events of a specific type coming from the given event target.
 */
import { fromEvent } from 'rxjs';
import {EventEmitter} from "events";

const eventEmitter = new EventEmitter();
const clicks = fromEvent(eventEmitter, 'nodeEvent');
clicks.subscribe(x => console.log(x));


eventEmitter.emit('nodeEvent', 'hello');
eventEmitter.emit('nodeEvent', 'world');
