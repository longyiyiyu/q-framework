/**
 * component.js
 * the factory function of component class
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');

/*
 * component 
 * main function for exports
 * @param   {String}    html        组件的html资源
 * @param   {String}    prototype   扩展组件类的prototype，从组件的js资源中构建获得
 * @param   {String}    static      扩展组件类的static，从组件的js资源中构建获得
 * @param   {String}    css         组件的css资源
 * @return  {Class}     component   组件类
 * 
 */
var component = function(html, prototype, static, css) {
    console.log('>>> component1:', html);

    var root = domUtil.getDomTree(html);

    util.walk(root, function(dom) {
        console.log('>>> walk:', dom);
        
    });
};

util.extend(component, {
});

module.exports = component;