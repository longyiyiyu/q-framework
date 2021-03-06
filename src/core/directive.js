/**
 * directive.js
 * the functions of managing directives
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');

var qIfKey = 'qIf';
var directives = {
    text: function(v, dom) {
        domUtil.setText(dom, v);
    },
    html: function(v, dom) {
        domUtil.setInnerHtml(dom, v);
    },
    'class': function(v, dom, w) {
        var data = this.optMap[w.id];
        var cn;
        var tar;

        if (!v) return;
        cn = ' ' + (domUtil.getClassName(dom) || '') + ' ';
        if (typeof v === 'object') {
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
        } else if (typeof v === 'string') {
            if (data.lastClassName) {
                tar = ' ' + data.lastClassName + ' ';
                while (cn.indexOf(tar) >= 0) {
                    cn = cn.replace(tar, ' ');
                }
            }

            if (cn.indexOf(' ' + v + ' ') < 0) {
                cn += v + ' ';
            }

            data.lastClassName = v;
        }

        domUtil.setClassName(dom, cn.trim());
    },
    attr: function(v, dom) {
        if (v === undefined || typeof v !== 'object') return;
        for (var k in v) {
            if (v.hasOwnProperty(k)) {
                if (k === 'style') {
                    for (var key in v[k]) {
                        if (v[k].hasOwnProperty(key)) {
                            domUtil.setStyle(dom, util.camelize(key), v[k][key]);
                        }
                    }
                } else if (k in dom) {
                    dom[k] = v[k];
                } else {
                    domUtil.setAttribute(dom, k, v[k]);
                }
            }
        }
    },
    css: function(v, dom) {
        if (!v || typeof v !== 'object') return;
        for (var key in v) {
            if (v.hasOwnProperty(key)) {
                domUtil.setStyle(dom, util.camelize(key), v[key]);
            }
        }
    },
    show: function(v, dom) {
        var dis;

        if (v) {
            domUtil.setStyle(dom, 'display', '');
            dis = domUtil.getStyle(dom, 'display');
            if (dis === 'none') {
                domUtil.setStyle(dom, 'display', 'block');
            }
        } else {
            domUtil.setStyle(dom, 'display', 'none');
        }
    },
    value: function(v, dom) {
        domUtil.setValue(dom, v);
    },
    on: function(v, dom) {
        var self = this;

        if (!v || typeof v !== 'object') return;

        // use redux will often enter here
        // don't bind many events!
        // there is not need to figure this problem, just use the first value;
        if (dom.__Q__hasBindEvents) {
            return;
        }

        for (var k in v) {
            if (v.hasOwnProperty(k)) {
                if (typeof v[k] === 'function') {
                    // TODO: add the capacity of useCapture argument
                    (function(type, cb) {
                        domUtil.addEventListener(dom, type, function(e) {
                            cb.call(self, e);
                        }, false);
                    })(k, v[k]);
                }
            }
        }

        dom.__Q__hasBindEvents = 1;
    },
    'if': function(v, dom, w) {
        var data = this.optMap[w.id];
        var value = !!v;
        var parent;

        if (!data.ref) {
            data.ref = document.createComment('q-if'); // TODO
            data.if_value = true;
        }

        if (value === data.if_value) {
            return;
        }

        if (value) {
            parent = domUtil.getParentNode(data.ref);
            parent && domUtil.replaceChild(parent, dom, data.ref);
            data.if_value = true;
        } else {
            parent = domUtil.getParentNode(dom);
            parent && domUtil.replaceChild(parent, data.ref, dom);
            data.if_value = false;
        }
    },

    // special for component
    child: function(np, w) {
        // console.log('>>> directive child:', np);
        var el = this.optMap[w.id].el;

        if (qIfKey in np) {
            directives['if'].call(this, np[qIfKey], el.getDom(), w);
        }

        if (qIfKey in np || qIfKey in el) { // 设置了 q-if 的组件
            el.update(np, false);
            if (!!np[qIfKey] || !!el[qIfKey]) {
                // 如果组件在 dom tree，则更新组件
                el.update(null, true);
            }
        } else {
            el.update(np);
        }
    }
};

function getDirective(key) {
    key = key.replace(/^q-/, '');

    // console.log('>>> getDirective:', key);
    return directives[key];
}

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        getDirective: getDirective
    });
}

module.exports = enhancer;
