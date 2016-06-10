var domUtil = require('../core/dom');

function walk(doms, cb) {
    var el;
    var children;

    if (!doms.length) {
        doms = [doms];
    }

    for (var i = 0, l = doms.length; i < l; ++i) {
        el = doms[i];
        if (domUtil.getNodeType(el) === 1) {
            cb(el);
        }

        children = domUtil.getChildNodes(el);
        if (children.length) {
            walk(children, cb);
        }
    }
}

function scan(dom, cb) {
    var atts = domUtil.getAttributes(dom);
    var res = [];

    for (var i = 0, l = atts.length; i < l; ++i) {
        if (atts[i].name.indexOf('q-') === 0) {
            res.push({
                name: atts[i].name,
                value: atts[i].value
            });
        }
    }

    if (res.length) {
        cb(res);
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

module.exports = {
    walk: walk,
    scan: scan,
    extend: extend
};
