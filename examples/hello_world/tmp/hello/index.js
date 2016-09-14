var Q = require('Q');
Q.component('<hello> <h1 q-text="title + &apos;aaa\\&apos;&apos;"> </h1> </hello>');
module.exports = Q;