require('./tmp/hello');

var Hello = Q.getComClass('hello');
var hello = new Hello('');

hello.update({
    title: 'Hello world!'
});

document.appendChild(hello.getDom());
