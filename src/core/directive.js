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
    html: function(v, dom) {
        domUtil.setInnerHtml(dom, v);
    },
    class: function(v, dom) {
        var cn;
        var tar;

        if (!v || typeof v !== 'object') return;
        cn = ' ' + (domUtil.getClassName(dom) || '') + ' ';
        for (var k in v) {
            if (v[k]) {
                if (cn.indexOf(' ' + k + ' ') < 0) {
                    cn += k + ' ';
                }
            } else {
                tar = ' ' + k + ' ';
                while (cn.indexOf(tar) >= 0) {
                    cn = cn.replace(tar, ' ');
                }
            }
        }

        domUtil.setClassName(dom, cn.trim());
    },
    attr: function(v, dom) {
        if (v === undefined) return;

    }
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
