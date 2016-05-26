// components/myCom.js
var Q = require('Q');

module.exports = Q.component('<mycom></mycom>', {
    init: function() {
    }
});



// Usage
var MyCom = require('components/myCom');

var myCom = new MyCom('<mycom></mycom>');

// 通过 props 更新，建议只在外部调用
myCom.update({
    prop1: 1
});

// 通过 state 更新，可以内外使用
myCom.setState({
    state1: 1
});

// 获取 dom tree 
var dom = myCom.getDom();