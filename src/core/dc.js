/**
 * dc.js
 * about dirty check
 * @author  longyiyiyu
 * 
 */

var tmpl = require('../lib/tmpl');
var util = require('../lib/util');

/*
 * init watcher
 */
function buildWatcher(obj, raw, expr, trigger) {
    var watcher = {
        id: util.getId(),
        raw: raw,
        expr: expr,
        trigger: trigger
    };

    obj.watcherMap[watcher.id] = watcher;
    obj.watchers.push(watcher);

    return watcher.id;
}

/*
 * init expression
 */
function makeExpr(expr) {
    console.log('>>> makeExpr:', expr);
    if (typeof expr === 'string') {
        return tmpl.compile(expr);
    } else if (typeof expr === 'object') {
        // return util.noop;
        return (function() {
            var o = {};
            var ret = {};

            for (var k in expr) {
                if (expr.hasOwnProperty(k)) {
                    o[k] = tmpl.compile(expr[k]);
                }
            }

            return function() {
                var temp = {};
                var hasChange = false;

                for (var k in o) {
                    temp[k] = o[k].call(this);
                    if (!hasChange && ret && ret[k] !== temp[k]) {
                        hasChange = true;
                    }
                }

                if (hasChange) {
                    ret = temp;
                }

                return ret;
            };
        })();
    }
}

/*
 * dirty check
 * dc 是属于component元素自己的，不是全局的
 * 
 */
function dc() {
    var w;
    var v;

    for (var i = 0, l = this.watchers.length; i < l; ++i) {
        w = this.watchers[i];
        v = w.expr.call(this /* , function err(err, ctx) {} */ );
        // console.log('>>> dc:', v);
        if (this.valueMap[w.id] !== v) {
            // 先设置新值，不然可能会死循环
            this.valueMap[w.id] = v;
            w.trigger.call(this, v, w);
        }
    }
}

/*
 * unwatch expression
 */
function unwatch(expr, trigger) {
    var w;

    for (var i = 0, l = this.watchers.length; i < l; ++i) {
        w = this.watchers[i];
        if (expr === w.raw && trigger === w.trigger) {
            this.watchers.splice(i, 1);
            delete this.watcherMap[w.id];
            break;
        }
    }
}

/*
 * watch expression
 */
function watch(expr, trigger) {
    if (!expr) return -1;
    return buildWatcher(this, expr, makeExpr(expr), trigger);
}

function enhancer(obj, proto, ori) {
    ori = ori || {};
    obj && util.extend(obj, {
        valueMap: {},
        watcherMap: util.extend({}, ori.watcherMap),
        watchers: ori.watchers ? ori.watchers.slice() : []
    });
    proto && util.extend(proto, {
        watch: watch,
        unwatch: unwatch,
        dc: dc
    });
}

module.exports = enhancer;
