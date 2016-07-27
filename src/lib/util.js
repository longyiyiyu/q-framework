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

function camelize(str) {
    return str.replace(/-+(.)?/g, function(match, chr) {
        return chr ? chr.toUpperCase() : '';
    });
}

/* listDiff begin */

/**
 * Convert list to key-item map
 * @param {Array}           list    the array
 * @param {String|Function} key     helper to find the key of item    
 * 
 */
function makeKeyMap(list, key) {
    var keyMap = {};
    var item;
    var itemKey;

    for (var i = 0, len = list.length; i < len; i++) {
        item = list[i];
        itemKey = item[key];
        if (itemKey) {
            keyMap[itemKey] = item;
        }
    }

    return keyMap;
}

function remove(patches, index) {
    patches.push({
        index: index,
        type: listDiff.REMOVE
    });
}

function insert(patches, index, item) {
    patches.push({
        index: index,
        item: item,
        type: listDiff.INSERT
    });
}

function printList(list, key) {
    var item;
    var itemKey;
    var str = '';

    for (var i = 0, l = list.length; i < l; ++i) {
        item = list[i];
        itemKey = item[key];
        str += (itemKey || '-1') + '|';
    }
    console.log('>>> printList:', str);
}

/*
 * diff two list in O(N).
 * @param {Array}   oldList     Original List
 * @param {Array}   newList     List After certain insertions, removes, or moves
 * @return {Object} { patches: <Array> }    
 *                    patches is a list of actions that telling how to remove and insert
 *                    
 */
function listDiff(oldList, newList, key) {
    var oldKeyMap = makeKeyMap(oldList, key);
    var newKeyMap = makeKeyMap(newList, key);
    var patches = [];

    // a simulate list to manipulate
    var simulateList = [];
    var i = 0;
    var item;
    var itemKey;
    var simulateItem;
    var simulateItemKey;

    console.log('>>> listDiff:');
    printList(oldList, key);
    console.log('');
    printList(newList, key);
    console.log('');

    // fist pass to check item in old list: if it's removed or not
    while (i < oldList.length) {
        item = oldList[i];
        itemKey = item[key];
        if (itemKey) {
            if (!(itemKey in newKeyMap)) {
                simulateList.push(null);
            } else {
                simulateList.push(oldKeyMap[itemKey]);
            }
        } else {
            // 根据经验，oldList 的 items 一定会有 key
            throw new Error('there is an item without key in oldList!');
        }
        i++;
    }

    // remove items no longer exist
    i = 0;
    while (i < simulateList.length) {
        if (simulateList[i] === null) {
            remove(patches, i);
            simulateList.splice(i, 1);
        } else {
            i++;
        }
    }

    // i is cursor pointing to a item in new list
    // j is cursor pointing to a item in simulateList
    var j = i = 0;
    var nextItemKey;
    var insertItemMap = {};
    while (i < newList.length) {
        item = newList[i];
        itemKey = item[key];
        simulateItem = simulateList[j];
        simulateItemKey = (simulateItem || {})[key];

        if (simulateItem) {
            if (itemKey === simulateItemKey) {
                // key 相等
                j++;
            } else {
                if (!oldKeyMap.hasOwnProperty(itemKey)) {
                    // new item, just inesrt it
                    insert(patches, i);
                } else {
                    while (simulateItemKey in insertItemMap) {
                        // simulateItem 已经在前面被 insert 了
                        delete insertItemMap[simulateItemKey];
                        simulateList.splice(j, 1);
                        simulateItem = simulateList[j];
                        simulateItemKey = (simulateItem || {})[key];
                    }

                    // looking forward one item
                    nextItemKey = (simulateList[j + 1] || {})[key];
                    if (nextItemKey === itemKey) {
                        remove(patches, i);
                        simulateList.splice(j, 1);
                        j++;
                    } else {
                        // itemKey 一定不是 undefined
                        insert(patches, i, oldKeyMap[itemKey]);
                        insertItemMap[itemKey] = 1;
                    }
                }
            }
        } else {
            insert(patches, i);
        }

        i++;
    }

    return patches;
}

listDiff.REMOVE = 0;
listDiff.INSERT = 1;

/* listDiff end */

module.exports = {
    getId: getId,
    walk: walk,
    scan: scan,
    listDiff: listDiff,
    extend: extend,
    noop: function() {},
    retTrue: function() {
        return true;
    },
    retFalse: function() {
        return false;
    },
    getRandomId: function() {
        return Math.ceil(Math.random() * 1000000);
    },
    camelize: camelize
};
