/**
 * repeat.js
 * the functions of repeat
 * @author  longyiyiyu
 * 
 */

var util = require('../lib/util');
var domUtil = require('./dom');
var Pool = require('../lib/componentPool');
var REPEATIDKEY = '__repeatId';

function removeInsertItem(list, index, key) {
    var item;
    var itemKey;

    while (index < list.length) {
        item = list[index];
        itemKey = item[REPEATIDKEY];
        if (itemKey === key) {
            list.splice(index, 1);
            break;
        }

        index++;
    }
}

/*
 * update the Repeat component
 * prototype method of Repeat component class
 * @param   {Array}    list         更新的列表
 * 
 */
function update(list) {
    var patches;
    var patch;
    var index;

    // console.log('>>> repeat update:', list);
    // if (typeof list !== 'object') {
    //     return;
    // }

    if (!(list instanceof Array)) {
        // list = [list];
        return;
    }

    var parent = domUtil.getParentNode(this.root);
    var item;
    var itemKey;
    var removeMap = {};

    // 没有 parent 就代表不在 dom tree 上面，直接退出
    if (!parent) return;

    patches = util.listDiff(this.items, list, REPEATIDKEY);
    // console.log('>>> patches:', patches);
    for (var i = 0, l = patches.length; i < l; ++i) {
        patch = patches[i];
        index = patch.index;
        item = patch.item;
        if (patch.type === util.listDiff.REMOVE) {
            itemKey = this.items[index][REPEATIDKEY];
            if (itemKey) {
                removeMap[itemKey] = this.items[index];
            }
            domUtil.removeChild(parent, this.items[index].getDom());
            this.items.splice(index, 1);
        } else {
            if (!item) {
                item = this.pool.get();
                item.parent = this.parent;
                delete item[REPEATIDKEY];
            }
            domUtil.insertBefore(parent, item.getDom(), (this.items[index] || this).getDom());
            itemKey = item[REPEATIDKEY];
            if (itemKey) {
                if (itemKey in removeMap) {
                    delete removeMap[itemKey];
                } else {
                    removeInsertItem(this.items, index, itemKey);
                }
            }
            this.items.splice(index, 0, item);
        }
    }

    var ext;
    i = 0;
    while (i < list.length) {
        item = this.items[i];
        if (!item) {
            throw new Error('there is something wrong of listDiff!');
        } else {
            itemKey = item[REPEATIDKEY];
            if (!itemKey) {
                item[REPEATIDKEY] = list[i][REPEATIDKEY] || util.getRandomId();
            }

            ext = {
                __index: i
            };
            ext[REPEATIDKEY] = item[REPEATIDKEY];
            item.update(util.extend(list[i], ext));
        }

        i++;
    }

    for (var k in removeMap) {
        this.pool.release(removeMap[k]);
    }

    // while (i < list.length) {
    //     if (!this.items[i]) {
    //         this.items[i] = this.pool.get();
    //         this.items[i].parent = this.parent;
    //         this.items[i].__repeatId = util.getRandomId();
    //         parent && domUtil.insertBefore(parent, this.items[i].getDom(), this.root);
    //     }

    // this.items[i].update(util.extend(list[i], {
    //     __index: i
    // }));
    //     i++;
    // }

    // while (i < this.items.length) {
    //     this.pool.release(this.items[i]);
    //     parent && domUtil.removeChild(parent, this.items[i].getDom());
    //     this.items.splice(i, 1);
    // }
}

/*
 * Repeat component class, internal class
 * @param   {Class}     itemClass   repeat item 类
 * @param   {String}    innerHtml   需要repeat的html片段
 * @param   {Array}     list        初始属性
 * 
 */
function Repeat(itemClass, innerHtml) {
    this.root = this.ref = document.createComment('q-repeat');

    // 预编译 item class
    this.itemClass = itemClass;
    this.pool = new Pool(this.itemClass, innerHtml);
    this.items = [];

    // list && this.update(list);
}

// 扩展 prototype
util.extend(Repeat.prototype, {
    setParent: function(p) {
        // TODO
        this.parent = p;
    },
    update: update,
    getDom: function() {
        // TODO
        return this.root;
    },
    getHtml: function() {
        // TODO
        return domUtil.getDomString(this.root);
    }
});

function enhancer(obj, proto) {
    proto && util.extend(proto, {
        Repeat: Repeat
    });
}

module.exports = enhancer;
