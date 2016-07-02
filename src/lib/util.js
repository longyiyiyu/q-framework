var domUtil = require('../core/dom');

// simple for init
var globalId = 1;

function getId() {
    return globalId++;
}

function walk(doms, cb) {
    var el;
    var children;
    var r;

    if (!doms || doms.length === 0) {
        return;
    }

    if (!doms.length) {
        doms = [doms];
    }

    for (var i = 0, l = doms.length; i < l; ++i) {
        el = doms[i];
        if (domUtil.getNodeType(el) === 1) {
            r = cb(el);
        }

        if (r === false) {
            continue;
        } else if (r && r !== true) {
            el = r;
        }

        children = domUtil.getChildNodes(el);
        if (children.length) {
            walk(children, cb);
        }
    }
}

function qFilter(k) {
    return k.indexOf('q-') === 0;
}

function scan(dom, cb, filter) {
    var atts = domUtil.getAttributes(dom);

    filter = filter || qFilter;
    for (var i = 0, l = atts.length; i < l; ++i) {
        if (filter(atts[i].name, atts[i].value)) {
            cb(atts[i].name, atts[i].value);
        }
    }
}

function extend(target, srcs) {
    var src;

    srcs = [].splice.call(arguments, 1);
    for (var i = 0, l = srcs.length; i < l; ++i) {
        src = srcs[i];
        for (var key in src) {
            target[key] = src[key];
        }
    }

    return target;
}

function getKeyFromDomProp(key) {
    return key.replace(/-([a-zA-Z])/g, function(m, letter) {
        return letter.toUpperCase();
    });
}

module.exports = {
    getId: getId,
    walk: walk,
    scan: scan,
    extend: extend,
    noop: function() {},
    retTrue: function() {
        return true;
    },
    retFalse: function() {
        return false;
    },
    getKeyFromDomProp: getKeyFromDomProp
};
