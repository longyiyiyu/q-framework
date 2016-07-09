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
var ev = require('./event');
var m = require('./mixin');

var ID_KEY = 'q-id-p';

var basePrototype = {
    setParent: function(p) {
        this.parent = p;
    },
    // TODO:
    // 直接获取 children 的意义并不大
    // 应该需要更好的获取 child 的方式
    // getChildren: function() {
    //     return this.children;
    // },
    // 关于 child 的操作不一定需要
    // 先暂时干掉
    // addChild: function(c) {
    //     this.children.push(c);
    // },
    // removeChild: function() {
    // },
    getDom: function() {
        return this.root;
    },
    getHtml: function() {
        return domUtil.getDomString(this.root);
    },
    update: function(props) {
        var self = this;
        var shouldUpdate;

        // console.log('>>> update:', props);
        this.trigger('update', props);
        if (this.shouldComponentUpdate) {
            shouldUpdate = this.shouldComponentUpdate(props);
        } else {
            shouldUpdate = true;
        }

        util.extend(this, props);
        if (shouldUpdate) {
            this.dc();
            setTimeout(function() {
                self.trigger('updated');
            }, 32);
        }
    }
};

function getYeildMap(root) {
    var map = {};
    var name;
    var key;
    var C;

    util.walk(root, function(dom) {
        name = domUtil.getNodeName(dom);
        C = getComClass(name);

        if (C) {
            return false;
        }

        if (name === 'yield') {
            key = domUtil.getAttribute(dom, 'to');
            map[key] = dom;
        }
    });

    return map;
}

/*
 * 获取节点的属性，组成对象
 */
function getPropsObj(dom) {
    var ret = {};
    var r = false;

    util.scan(dom, function(k, v) {
        r = true;
        ret[util.getKeyFromDomProp(k)] = v;
    }, util.retTrue);

    return r ? ret : null;
}

/*
 * build component obj from its class
 */
function buildComponent(C, c) {
    c._html = C._html;
    c.children = [];
    c.optMap = {};

    dc(c, null, C);
    ev(c);
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
var component = function(html, prototype, css) {
    var self = this;
    var root = domUtil.getDomTree(html)[0];
    var comName = domUtil.getNodeName(root);
    var temp;

    console.log('>>> component1:', html, comName);

    var clazz = function(innerHtml, props) {
        var that = this;
        var innerDom;
        var innerYieldMap;

        console.log('>>> new clazz:', clazz.comName, innerHtml, props);

        if (typeof innerHtml === 'object' && !props) {
            props = innerHtml;
            innerHtml = '';
        }

        buildComponent(clazz, this);

        // TODO:
        // this._html = util.replaceYields(this._html, innerHtml);

        if (innerHtml) {
            innerDom = domUtil.getDomTree(innerHtml);
            // 一般传进来yield就说明clazz本身是支持这些yield的
            // 因此这里可以预编译，把传进来的yield先解析出来
            innerYieldMap = getYeildMap(innerDom);
        }

        this.root = domUtil.getDomTree(this._html)[0];
        util.walk(domUtil.getChildNodes(this.root), function(dom) {
            var name = domUtil.getNodeName(dom);
            var C = self.getComClass(name);
            var p;
            var ids;
            var id;
            var child;
            var yieldKey;
            var yieldDom;

            if (name === 'yield') {
                yieldKey = domUtil.getAttribute(dom, 'from');
                yieldDom = innerYieldMap[yieldKey];
                if (yieldDom) {
                    // console.log('>>> find yield:', dom, domUtil.getInnerHtml(dom), yieldDom, domUtil.getInnerHtml(yieldDom));
                    domUtil.replaceChild(domUtil.getParentNode(dom), yieldDom, dom);

                    return yieldDom;
                } else {
                    domUtil.removeChild(domUtil.getParentNode(dom), dom);
                    return false;
                }
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
                    // console.log('>>> CCC:', C.comName, dom, domUtil.getInnerHtml(dom));
                    child = new C(domUtil.getInnerHtml(dom));
                    that.children.push(child);
                    child.setParent(that);

                    if (ids !== 1) {
                        if (ids && ids.length) {
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

                    domUtil.replaceChild(domUtil.getParentNode(dom), child.getDom(), dom);

                    return false;
                } else {
                    if (ids !== 1) {
                        if (ids && ids.length) {
                            for (var i = 0, l = ids.length; i < l; ++i) {
                                that.optMap[ids[i]] = {
                                    el: dom
                                };
                            }
                        } else {
                            util.scan(dom, function(k, v) {
                                var id = that.watch(v, function(nv, w) {
                                    self.getDirective(k).call(this, nv, this.optMap[w.id].el);
                                });

                                that.optMap[id] = {
                                    el: dom
                                };
                            });
                        }
                    }
                }
            }
        });

        this.trigger('init');

        util.extend(this, this.defaultProps);
        if (props) {
            this.update(props);
        }
    };

    // enhance clazz
    dc(null, clazz.prototype);
    ev(null, clazz.prototype);
    m(null, clazz.prototype);

    // clazz itself must have capacity of dc
    dc(clazz, clazz);

    // 预处理，和正式处理很像，基本一致
    // 不同：正式处理还会处理yield出来的那部分
    // 这里只是为了加速expr的编译速度，但是加了一些“重复”代码
    util.walk(domUtil.getChildNodes(root), function(dom) {
        console.log('>>> walk:', dom);
        var name = domUtil.getNodeName(dom);
        var C = self.getComClass(name);
        var p;
        var ids = [];

        // 预编译阶段不需要解析 yield
        if (name === 'yield') {
            return true;
        } else {
            if (C) {
                p = getPropsObj(dom);
                if (p) {
                    ids.push(clazz.watch(p, function(np, w) {
                        this.optMap[w.id].el.update(np);
                    }));
                }

                domUtil.setAttribute(dom, ID_KEY, ids.length ? JSON.stringify(ids) : 1);
                return false;
            } else {
                util.scan(dom, function(k, v) {
                    ids.push(clazz.watch(v, function(nv, w) {
                        self.getDirective(k).call(this, nv, this.optMap[w.id].el);
                    }));
                });
            }

            domUtil.setAttribute(dom, ID_KEY, ids.length ? JSON.stringify(ids) : 1);
        }
    });

    prototype = prototype || {};

    // 扩展 statics
    util.extend(clazz, {
        comName: comName,
        _html: domUtil.getDomString(root)
    }, prototype.statics);
    delete prototype.statics;

    // prototype.getDefaultProps
    if (prototype.getDefaultProps && typeof prototype.getDefaultProps === 'function') {
        temp = prototype.getDefaultProps();
        if (temp && typeof temp === 'object') {
            clazz.prototype.defaultProps = temp;
        }

        delete prototype.getDefaultProps;
    }

    // 扩展 prototype
    util.extend(clazz.prototype, basePrototype, prototype);

    // 注册组件
    this.setComClass(comName, clazz);

    console.log('>>> clazz:', clazz, clazz.comName + '1', clazz._html, clazz.watcherMap, clazz.watchers);

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

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        component: component,
        setComClass: setComClass,
        getComClass: getComClass
    });
}

module.exports = enhancer;
