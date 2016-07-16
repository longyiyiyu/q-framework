/**
 * repeat.js
 * the functions of repeat
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');
var Pool = require('../lib/componentPool');

function itemClassFactory(innerHtml) {}

/*
 * update the Repeat component
 * prototype method of Repeat component class
 * @param   {Array}    list         更新的列表
 * 
 */
function update(list) {
    
}

/*
 * Repeat component class, internal class
 * @param   {String}    innerHtml   需要repeat的html片段
 * @param   {Array}     list        初始属性
 * 
 */
function Repeat(innerHtml, list) {
    this.root = this.ref = document.createComment('q-repeat');

    // 预编译 item class
    this.itemClass = itemClassFactory(innerHtml);
    this.pool = new Pool(this.itemClass);
    this.items = [];

    list && this.update(list);
}

// 扩展 prototype
util.extend(Repeat.prototype, {
    update: update,
    getDom: function() {
        return this.root;
    },
    getHtml: function() {
        return domUtil.getDomString(this.root);
    },
});

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        Repeat: Repeat
    });
}

module.exports = enhancer;
