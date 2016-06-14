/**
 * directive.js
 * the functions of managing directives
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');

function getDirective(key) {
    console.log('>>> getDirective:', key);
}

function enhancer(obj) {
    util.extend(obj, {
        getDirective: getDirective
    });
}

module.exports = enhancer;