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
function makeKeyMapAndFree(list, key) {
    var keyMap = {};
    var free = [];
    var item;
    var itemKey;

    for (var i = 0, len = list.length; i < len; i++) {
        item = list[i];
        itemKey = getItemKey(item, key);
        if (itemKey) {
            keyMap[itemKey] = item;
        } else {
            free.push(item);
        }
    }

    return {
        keyMap: keyMap,
        free: free
    };
}

/**
 * find the key of item
 * @param {Object}          item    the item
 * @param {String|Function} key     helper to find the key of item    
 * 
 */
function getItemKey(item, key) {
    if (!item || !key) return void 666;
    return typeof key === 'string' ? item[key] : key(item);
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

/*
 * diff two list in O(N).
 * @param {Array}   oldList     Original List
 * @param {Array}   newList     List After certain insertions, removes, or moves
 * @return {Object} { patches: <Array> }    
 *                    patches is a list of actions that telling how to remove and insert
 *                    
 */
function listDiff(oldList, newList, key) {
    var oldMap = makeKeyMapAndFree(oldList, key);
    var newMap = makeKeyMapAndFree(newList, key);
    var oldKeyMap = oldMap.keyMap;
    var newKeyMap = newMap.keyMap;
    var oldFree = oldMap.free;
    var patches = [];

    // a simulate list to manipulate
    var children = [];
    var i = 0;
    var item;
    var itemKey;
    var simulateItem;
    var simulateItemKey;
    var freeIndex = 0;

    // fist pass to check item in old list: if it's removed or not
    while (i < oldList.length) {
        item = oldList[i];
        itemKey = getItemKey(item, key);
        if (itemKey) {
            if (!(itemKey in newKeyMap)) {
                children.push(null);
            } else {
                children.push(oldKeyMap[itemKey]);
            }
        } else {
            children.push(oldFree[freeIndex++] || null);
        }
        i++;
    }

    // console.log('>>> children:', children);
    var simulateList = children.slice(0);

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
    while (i < newList.length) {
        item = newList[i];
        itemKey = getItemKey(item, key);
        simulateItem = simulateList[j];
        simulateItemKey = getItemKey(simulateItem, key);

        if (simulateItem) {
            if (itemKey === simulateItemKey) {
                j++;
            } else {
                if (!oldKeyMap.hasOwnProperty(itemKey)) {
                    // new item, just inesrt it
                    insert(patches, i);
                } else {
                    // looking forward one item
                    nextItemKey = getItemKey(simulateList[j + 1], key);
                    if (nextItemKey === itemKey) {
                        remove(i);
                        simulateList.splice(j, 1);
                        j++;
                    } else {
                        insert(patches, i, oldKeyMap[itemKey]);
                    }
                }
            }
        } else {
            insert(patches, i);
        }

        i++;
    }

    return {
        patches: patches,
        children: children
    };
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
    camelize: camelize
};
