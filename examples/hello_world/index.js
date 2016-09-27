var Q = require('Q');

require('com/hello');

require('./tmp/hello/index.js');

var Hello = Q.getComClass('hello');
var hello = new Hello('');

hello.update({
    title: 'Hello world!'
});

document.body.appendChild(hello.getDom());
