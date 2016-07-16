/**
 * componentPool.js
 * a pool of components
 * which components must use new to create
 * and use destroy to release
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');

/*
 * 组件池类
 * @param   {Class}     clazz       组件类
 * 
 */
function Pool(clazz) {
    this.clazz = clazz;
    this.cache = [];
}

/*
 * 获取组件实例
 * @return      {Object}    组件实例
 * 
 */
function get() {
    if (this.cache.length) {
        return this.cache.pop();
    } else {
        return new this.clazz();
    }
}

/*
 * 获取组件实例
 * @param      {Object}    obj      组件实例
 * 
 */
function release(obj) {
    obj.destroy();
    this.cache.push(obj);
}

// 扩展 prototype
util.extend(Pool.prototype, {
    get: get,
    release: release
});

module.exports = Pool;
