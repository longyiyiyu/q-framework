__ENV__ = 'B';

var Q = require('../../src/Q');

var MyCom3 = Q.component('<MyCom3><h2 q-text="title"></h2></MyCom3>');

var MyCom = Q.component('<myCom><h1 q-text="title"></h1><MyCom3 title="title + \' \' + summary"></MyCom3><p>constant</p><p q-text="summary" q-class="{big: isBig, blue: isBlue}"></p></myCom>');

var Com1 = Q.component('<com1><yield from="p1"></yield><h2 q-text="title"></h2><yield from="p2"></yield></com1>');

var Com2 = Q.component('<com2><yield from="p1"></yield><h3 q-text="title"></h3><yield from="p2"></yield></com2>');

var MyCom2 = Q.component('<myCom2>  <com1 q-if="!ifValue" title="title+\' Long! \'" html="html" desc="summary" title2="title + \'2\'"><yield to="p1"><p q-html="html"></p></yield>  <yield to="p2"><com2 title="title+\' try! \'" title2="title2"><yield to="p1"><h1 q-text="\'title: \' + title2"></h1></yield></com2></yield></com1>   <br/><br/>   <h1 q-text="title"></h1><myCom title="title" summary="summary" is-blue="isBlue" is-big="1"></myCom><p q-text="author" q-class="{aa:isBlue, bb:0}"></p><MyCom3 title="summary"></MyCom3>  <br/><br/>  <p q-attr="attrs">aaa</p> <p q-css="attrs.style">aaabbb</p>  <p q-show="isShow">aaabbbccc</p> <input type="checkbox" q-value="isCheck">isCheck</input> <input type="text" q-value="textValue"></input> <a href="javascript:" q-on="aEvents">test directive on</a>  <p q-if="ifValue">if this is true!</p><p q-if="!ifValue">if this is false!</p> </myCom2>', {
    getDefaultProps: function() {
        return {
            isBlue: 1
        };
    }
});

// var c = new MyCom();
var c2 = new MyCom2();

console.log('new com:', c2);

// c.update({
//     title: 'Hello world!',
//     summary: 'hahahaha',
//     isBig: false,
//     isBlue: 1
// });

var testFun = function(e) {
    console.log('>>> testFun:', e.type, e, this);
};

c2.update({
    title: 'Hello world!',
    summary: 'hahahaha',
    author: 'long',
    html: '<a href="javascript:" >haha</a>',
    attrs: {
        style: {
            'background-color': 'green',
            color: 'red'
        },
        'data-id': 'abc'
    },
    isShow: false,
    isCheck: true,
    textValue: '',
    aEvents: {
        click: testFun,
        mousedown: testFun
    },
    ifValue: 1
});

console.log('after update:', c2, c2.getHtml());

c2.update({
    isBlue: 0,
    author: 'jack'
});

console.log('after update:', c2, c2.getHtml());

c2.update({
    title: 'Hello world!!!'
});

setTimeout(function() {
    c2.update({
        title: 'aaaa Hello world!',
        isShow: true,
        isCheck: false,
        textValue: 'Hello',
        ifValue: 0
    });
}, 1000);

window.onload = function() {
    document.getElementById('test').appendChild(c2.getDom());
};
