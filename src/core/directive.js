/**
 * directive.js
 * the functions of managing directives
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');

var directives = {
    text: function(v, dom) {
        domUtil.setText(dom, v);
    },
    class: function(v, dom) {
        // 这里需要优化
        console.log('>>> directive class:', v, dom);
        if (!v || typeof v !== 'object') return;
        for (var k in v) {
            if (v[k]) {
                domUtil.addClass(dom, k);
            } else {
                domUtil.removeClass(dom, k);
            }
        }
    },
};

function getDirective(key) {
    key = key.replace(/^q-/, '');

    return directives[key];
}

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        getDirective: getDirective
    });
}

module.exports = enhancer;
