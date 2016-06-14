/**
 * component.js
 * the factory function of component class
 * @author  longyiyiyu
 * 
 */

var tmpl = require('../lib/tmpl');
var util = require('../lib/util');
var domUtil = require('./dom');
var dc = require('./dc');
var yd = require('./yield');

var ID_KEY = 'q-id-p';

var basePrototype = {
    getDom: function() {
        return this.root;
    },
    getHtml: function() {
        return this._html;
    },
    update: function(props) {
        // 建议只由外部调用
        props && util.extend(this, props);
        this.dc();
    }
};

/*
 * 获取节点的属性，组成对象
 */
function getPropsObj(dom) {
    var ret = {};
    var r = false;

    util.scan(dom, function(k, v) {
        r = true;
        ret[k] = v;
    }, util.retTrue);

    return r ? ret : null;
}

/*
 * build component obj from its class
 */
function buildComponent(C, c) {
    dc(c, C);
    c._html = C._html;
    c.children = [];
    c.optMap = {};
}

/*
 * component 
 * main function for exports
 * import to Q
 * @param   {String}    html        组件的html资源
 * @param   {String}    prototype   扩展组件类的prototype，从组件的js资源中构建获得
 * @param   {String}    static      扩展组件类的static，从组件的js资源中构建获得
 * @param   {String}    css         组件的css资源
 * @return  {Class}     component   组件类
 * 
 */
var component = function(html, prototype, statics, css) {
    var self = this;
    var root = domUtil.getDomTree(html)[0];

    console.log('>>> component1:', html);

    var clazz = function(innerHtml, props) {
        var that = this;

        buildComponent(clazz, this);

        // TODO:
        // this._html = util.replaceYields(this._html, innerHtml);

        this.root = domUtil.getDomTree(this._html)[0];
        util.walk(domUtil.getChildNodes(this.root), function(dom) {
            var name = domUtil.getNodeName(dom);
            var C = self.getComClass(name);
            var p;
            var ids;
            var id;
            var child;

            if (name === 'yield') {
                // TODO:
            } else {
                ids = domUtil.getAttribute(dom, ID_KEY);
                if (ids) {
                    try {
                        ids = JSON.parse(ids);
                    } catch (e) {
                        console.log('parse ID_KEY error:', domUtil.getAttribute(dom, ID_KEY));
                        ids = [];
                    }
                }

                if (C) {
                    child = new C(domUtil.getInnerHtml(dom));
                    that.children.push(child);

                    if (ids != 1) {
                        if (ids.length) {
                            id = ids[0];
                        } else {
                            p = getPropsObj(dom);
                            if (p) {
                                id = that.watch(p, function(np, w) {
                                    this.optMap[w.id].el.update(np);
                                });
                            }
                        }

                        if (id) {
                            that.optMap[id] = {
                                el: child
                            };
                        }
                    }

                    return false;
                } else {
                    if (ids != 1) {
                        if (ids.length) {
                            for (var i = 0, l = ids.length; i < l; ++i) {
                                that.optMap[id] = {
                                    el: dom
                                };
                            }
                        } else {
                            util.scan(dom, function(k, v) {
                                var id = that.watch(v, self.getDirective(k));

                                that.optMap[id] = {
                                    el: dom
                                };
                            });
                        }
                    }
                }
            }
        });

        if (props) {
            util.extend(this, props);

            this.update();
        }
    };

    dc(clazz);
    yd(clazz);

    // 预处理，和正式处理很像，基本一致
    // 不同：正式处理还会处理yield出来的那部分
    // 这里只是为了加速expr的编译速度，但是加了一些“重复”代码
    util.walk(domUtil.getChildNodes(root), function(dom) {
        console.log('>>> walk:', dom);
        var name = domUtil.getNodeName(dom);
        var C = self.getComClass(name);
        var p;
        var ids = [];

        if (name === 'yield') {
            // TODO:
            // clazz.setYield(dom);
        } else {
            if (C) {
                p = getPropsObj(dom);
                if (p) {
                    ids.push(clazz.watch(p, function(np, w) {
                        this.optMap[w.id].el.update(np);
                    }));
                }

                return false;
            } else {
                util.scan(dom, function(k, v) {
                    ids.push(clazz.watch(v, self.getDirective(k)));
                });
            }

            domUtil.setAttribute(dom, ID_KEY, ids.length ? JSON.stringify(ids) : 1);
        }
    });

    // 扩展 prototype
    util.extend(clazz.prototype, basePrototype, prototype);

    // 扩展 statics
    util.extend(clazz, {
        _html: domUtil.getDomString(root)
    }, statics);

    this.setComClass(domUtil.getNodeName(root), clazz);

    console.log('>>> clazz:', clazz, clazz._html, clazz.watcherMap, clazz.watchers);

    return clazz;
};

/*
 * the cache for classes of component
 */
var cache = {};

function setComClass(name, C) {
    cache[name.toLowerCase()] = C;
}

function getComClass(name) {
    return cache[name.toLowerCase()];
}

function enhancer(obj) {
    util.extend(obj, {
        component: component,
        setComClass: setComClass,
        getComClass: getComClass
    });
}

module.exports = enhancer;
