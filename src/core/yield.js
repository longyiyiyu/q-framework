
/**
 * yield.js
 * about processing yield blocks
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');

function setYield(dom) {
    var f = domUtil.getAttribute(dom, 'from');

    this.yieldMap[f] = this.yieldMap[f] || dom;
}

function enhancer(obj) {
    util.extend(obj, {
        yieldMap: {},
        setYield: setYield
    });
}

module.exports = enhancer;