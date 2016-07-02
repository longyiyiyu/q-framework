/**
 * event.js
 * the functions of event
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');

/**
 * Helper function needed to get and loop all the events in a string
 * @param   { String }   events     事件类型
 * @param   {Function}   fn(t, ns)  callback
 * @param   { String }   fn.t       事件类型
 * @param   { String }   fn.ns      命名空间
 * 
 */
function onEachEvent(events, fn) {
    var es;
    var name;
    var indx;

    if (!events || typeof events !== 'string') {
        return;
    }

    es = events.trim().split(' ');
    for (var i = 0, l = es.length; i < l; i++) {
        name = es[i];
        indx = name.indexOf('.');
        if (name) {
            fn((~indx ? name.substring(0, indx) : name).trim(), (~indx ? name.slice(indx + 1) : null).trim());
        }
    }
}

/*
 * 注册事件
 * @param   { String }  events  事件类型，支持多事件与命名空间，比如：'a.ns1 b.ns2'
 * @param   {Function}  cb      事件回调
 * @return  { Object }  this
 *
 * 注意，在注册事件回调的时候，命名空间要一致
 * 一个cb只能属于一个命名空间，如果出现多个命名空间，将可能出现你不想要的结果
 * 
 */
function on(events, cb) {
    var self = this;

    if (typeof cb != 'function') return this;
    onEachEvent(events, function(t, ns) {
        if (t === '*') return; // 不支持 '*' 类型
        (self.events[name] = self.events[name] || []).push(cb);
        cb.ns = ns;
    });

    return this;
}

/*
 * 解绑事件回调的辅助函数
 * @param   { Array  }  arr     回调数组
 * @param   {Function}  [cb]    事件回调
 * @param   { String }  [ns]    命名空间
 * 
 */
function removeCB(arr, cb, ns) {
    for (var i = 0, fn; fn = arr[i]; ++i) {
        if (cb === fn || fn.ns === ns) {
            arr.splice(i--, 1);
        }
    }
}

/*
 * 解绑事件
 * @param   { String }  events  事件类型，支持多事件，命名空间 + '*'，比如：'a b', '*.ns3'
 * @param   {Function}  [cb]    事件回调，如果不提供cb，则删除事件类型的所有回调
 * @return  { Object }  this
 * 
 */
function off(events, cb) {
    var self = this;
    var arr;

    if (!events || typeof events !== 'string') return;
    if (events.trim() === '*' && !cb) this.events = {}; // 快速处理特殊情况
    else {
        onEachEvent(events, function(t, ns) {
            if (t === '*') {
                for (var k in self.events) {
                    removeCB(self.events[k], cb, ns);
                }
            } else {
                if (!ns && !cb) self.events[t] = []; // 快速处理特殊情况
                else removeCB(self.events[t], cb, ns);
            }
        });
    }

    return this;
}

/*
 * 注册一次性事件
 * @param   { String }  events  事件类型，支持多事件与命名空间，比如：'a.ns1 b.ns2'
 * @param   {Function}  cb      事件回调
 * @return  { Object }  this
 * 
 */
function one(events, cb) {
    return this;
}

/*
 * 触发事件
 * @param   {String}    events      事件类型，支持多事件，比如：'a b'
 * @param   {*}         [args...]   事件回调的参数
 * @return  {Object}    this
 * 
 */
function trigger(events) {
    var self = this;
    var arglen = arguments.length;
    var args = new Array(arglen);
    var fns;

    for (var i = 1; i < arglen; i++) {
        args[i] = arguments[i];
    }

    onEachEvent(events, function(t, ns) {
        fns = self.events[t];
        if (!fns) return;
        args[0] = {
            type: t
        };
        for (var i = 0, l = fns.length; i < l; ++i) {
            fns[i].apply(this, args);
        }
    });

    return this;
}

function enhancer(obj, proto) {
    obj && util.extend(obj, {
        events: {}
    });

    proto && util.extend(proto, {
        on: on,
        off: off,
        one: one,
        trigger: trigger
    });
}

module.exports = enhancer;
