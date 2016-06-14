__ENV__ = 'B';

var Q = require('../../src/Q');

var MyCom = Q.component('<myCom><h1 q-text="title"></h1><p q-text="summary" q-class="{big: isBig}"></p></myCom>');

console.log('new com:', new MyCom());