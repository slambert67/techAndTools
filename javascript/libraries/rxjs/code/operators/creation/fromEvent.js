"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var events_1 = require("events");
var eventEmitter = new events_1.EventEmitter();
var clicks = (0, rxjs_1.fromEvent)(eventEmitter, 'nodeEvent');
clicks.subscribe(function (x) { return console.log(x); });
eventEmitter.emit('nodeEvent', 'hello');
eventEmitter.emit('nodeEvent', 'world');
