__ENV__ = 'B';

var Q = require('../../src/Q');

var MyCom3 = Q.component('<MyCom3><h2 q-text="title"></h2></MyCom3>');

var MyCom = Q.component('<myCom><h1 q-text="title"></h1><MyCom3 title="title + \' \' + summary"></MyCom3><p>constant</p><p q-text="summary" q-class="{big: isBig, blue: isBlue}"></p></myCom>');

var Com1 = Q.component('<com1><yield from="p1"></yield><h2 q-text="title"></h2><yield from="p2"></yield></com1>');

var Com2 = Q.component('<com2><yield from="p1"></yield><h3 q-text="title"></h3><yield from="p2"></yield></com2>');

var MyCom2 = Q.component('<myCom2>  <com1 title="title+\' Long! \'" desc="summary" title2="title + \'2\'"><yield to="p1"><p q-text="desc"></p></yield>  <yield to="p2"><com2 title="title+\' try! \'" title2="title2"><yield to="p1"><h1 q-text="\'title: \' + title2"></h1></yield></com2></yield></com1>   <br/><br/>   <h1 q-text="title"></h1><myCom title="title" summary="summary" is-blue="isBlue" is-big="1"></myCom><p q-text="author"></p><MyCom3 title="summary"></MyCom3></myCom2>');

// var c = new MyCom();
var c2 = new MyCom2();

console.log('new com:', c2);

// c.update({
//     title: 'Hello world!',
//     summary: 'hahahaha',
//     isBig: false,
//     isBlue: 1
// });

c2.update({
    title: 'Hello world!',
    summary: 'hahahaha',
    isBlue: 1,
    author: 'long'
});

console.log('after update:', c2, c2.getHtml());

c2.update({
    author: 'jack'
});

console.log('after update:', c2, c2.getHtml());

c2.update({
    title: 'Hello world!!!'
});

window.onload = function() {
    document.getElementById('test').appendChild(c2.getDom());
};
