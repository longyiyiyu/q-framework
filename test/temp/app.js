/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__ENV__ = 'B';

	var Q = __webpack_require__(1);

	var MyCom3 = Q.component('<MyCom3><h2 q-text="title"></h2></MyCom3>');

	var MyCom = Q.component('<myCom><h1 q-text="title"></h1><MyCom3 title="title + \' \' + summary"></MyCom3><p>constant</p><p q-text="summary" q-class="{big: isBig, blue: isBlue}"></p></myCom>');

	var Com1 = Q.component('<com1><yield from="p1"></yield><h2 q-text="title"></h2><yield from="p2"></yield></com1>');

	var Com2 = Q.component('<com2><yield from="p1"></yield><h3 q-text="title"></h3><yield from="p2"></yield></com2>');

	var MyCom2 = Q.component('<myCom2>  <com1 q-if="!ifValue" title="title+\' Long! \'" html="html" desc="summary" title2="title + \'2\'"><yield to="p1"><p q-html="html"></p></yield>  <yield to="p2"><com2 title="title+\' try! \'" title2="title2"><yield to="p1"><h1 q-text="\'title: \' + title2"></h1></yield></com2></yield></com1>   <br/><br/>   <h1 q-text="title"></h1><myCom title="title" summary="summary" is-blue="isBlue" is-big="1"></myCom><p q-text="author" q-class="{aa:isBlue, bb:0}"></p><MyCom3 title="summary"></MyCom3>  <br/><br/>  <p q-attr="attrs">aaa</p> <p q-css="attrs.style">aaabbb</p>  <p q-show="isShow">aaabbbccc</p> <input type="checkbox" q-value="isCheck">isCheck</input> <input type="text" q-value="textValue"></input> <a href="javascript:" q-on="aEvents">test directive on</a>  <p q-if="ifValue">if this is true!</p><p q-if="!ifValue">if this is false!</p> </myCom2>', {
	    getDefaultProps: function() {
	        return {
	            isBlue: 1
	        };
	    }
	});

	// var c = new MyCom();
	var c2 = new MyCom2();

	console.log('new com:', c2);

	// c.update({
	//     title: 'Hello world!',
	//     summary: 'hahahaha',
	//     isBig: false,
	//     isBlue: 1
	// });

	var testFun = function(e) {
	    console.log('>>> testFun:', e.type, e, this);
	};

	c2.update({
	    title: 'Hello world!',
	    summary: 'hahahaha',
	    author: 'long',
	    html: '<a href="javascript:" >haha</a>',
	    attrs: {
	        style: {
	            'background-color': 'green',
	            color: 'red'
	        },
	        'data-id': 'abc'
	    },
	    isShow: false,
	    isCheck: true,
	    textValue: '',
	    aEvents: {
	        click: testFun,
	        mousedown: testFun
	    },
	    ifValue: 1
	});

	console.log('after update:', c2, c2.getHtml());

	c2.update({
	    isBlue: 0,
	    author: 'jack'
	});

	console.log('after update:', c2, c2.getHtml());

	c2.update({
	    title: 'Hello world!!!'
	});

	setTimeout(function() {
	    c2.update({
	        title: 'aaaa Hello world!',
	        isShow: true,
	        isCheck: false,
	        textValue: 'Hello',
	        ifValue: 0
	    });
	}, 1000);

	window.onload = function() {
	    document.getElementById('test').appendChild(c2.getDom());
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Q.js
	 * the version 2 of Qjs which is a ui framework
	 * when the version 1 of Qjs is a mvvm framwork
	 *
	 * @author  longyiyiyu
	 * @version 2.0.0
	 * 
	 */
	var Q = {
	    version: '2.0.0'
	};

	// enhance directive
	__webpack_require__(2)(Q, Q);

	// enhance component
	__webpack_require__(7)(Q, Q);

	// enhance repeat
	__webpack_require__(12)(Q, Q);

	// enhance mixin
	__webpack_require__(11)(Q, Q);

	module.exports = Q;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * directive.js
	 * the functions of managing directives
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);
	var domUtil = __webpack_require__(4);

	var qIfKey = 'qIf';
	var directives = {
	    text: function(v, dom) {
	        domUtil.setText(dom, v);
	    },
	    html: function(v, dom) {
	        domUtil.setInnerHtml(dom, v);
	    },
	    'class': function(v, dom) {
	        var cn;
	        var tar;

	        if (!v || typeof v !== 'object') return;
	        cn = ' ' + (domUtil.getClassName(dom) || '') + ' ';
	        for (var k in v) {
	            if (v[k]) {
	                if (cn.indexOf(' ' + k + ' ') < 0) {
	                    cn += k + ' ';
	                }
	            } else {
	                tar = ' ' + k + ' ';
	                while (cn.indexOf(tar) >= 0) {
	                    cn = cn.replace(tar, ' ');
	                }
	            }
	        }

	        domUtil.setClassName(dom, cn.trim());
	    },
	    attr: function(v, dom) {
	        if (v === undefined || typeof v !== 'object') return;
	        for (var k in v) {
	            if (v.hasOwnProperty(k)) {
	                if (k === 'style') {
	                    for (var key in v[k]) {
	                        if (v[k].hasOwnProperty(key)) {
	                            domUtil.setStyle(dom, util.camelize(key), v[k][key]);
	                        }
	                    }
	                } else if (k in dom) {
	                    dom[k] = v;
	                } else {
	                    domUtil.setAttribute(dom, k, v[k]);
	                }
	            }
	        }
	    },
	    css: function(v, dom) {
	        if (v === undefined || typeof v !== 'object') return;
	        for (var key in v) {
	            if (v.hasOwnProperty(key)) {
	                domUtil.setStyle(dom, util.camelize(key), v[key]);
	            }
	        }
	    },
	    show: function(v, dom) {
	        var dis;

	        if (v) {
	            domUtil.setStyle(dom, 'display', '');
	            dis = domUtil.getStyle(dom, 'display');
	            if (dis === 'none') {
	                domUtil.setStyle(dom, 'display', 'block');
	            }
	        } else {
	            domUtil.setStyle(dom, 'display', 'none');
	        }
	    },
	    value: function(v, dom) {
	        domUtil.setValue(dom, v);
	    },
	    on: function(v, dom) {
	        var self = this;

	        if (!v || typeof v !== 'object') return;

	        // use redux will often enter here
	        // don't bind many events!
	        // there is not need to figure this problem, just use the first value;
	        if (dom.__Q__hasBindEvents) {
	            return;
	        }

	        for (var k in v) {
	            if (v.hasOwnProperty(k)) {
	                if (typeof v[k] === 'function') {
	                    // TODO: add the capacity of useCapture argument
	                    domUtil.addEventListener(dom, k, function(e) {
	                        v[k].call(self, e);
	                    }, false);
	                }
	            }
	        }

	        dom.__Q__hasBindEvents = 1;
	    },
	    'if': function(v, dom, w) {
	        var data = this.optMap[w.id];
	        var value = !!v;
	        var parent;

	        if (!data.ref) {
	            data.ref = document.createComment('q-if');
	            data.if_value = true;
	        }

	        if (value === data.if_value) {
	            return;
	        }

	        if (value) {
	            parent = domUtil.getParentNode(data.ref);
	            parent && domUtil.replaceChild(parent, dom, data.ref);
	            data.if_value = true;
	        } else {
	            parent = domUtil.getParentNode(dom);
	            parent && domUtil.replaceChild(parent, data.ref, dom);
	            data.if_value = false;
	        }
	    },
	    repeat: function(v, dom, w) {

	    },

	    // special for component
	    child: function(np, w) {
	        // console.log('>>> directive child:', np);
	        var el = this.optMap[w.id].el;


	        if (qIfKey in np) {
	            directives['if'].call(this, np[qIfKey], el.getDom(), w);
	        }

	        if (qIfKey in np || qIfKey in el) { // 设置了 q-if 的组件
	            el.update(np, false);
	            if (!!np[qIfKey] || !!el[qIfKey]) {
	                // 如果组件在 dom tree，则更新组件
	                el.update(null, true);
	            }
	        } else {
	            el.update(np);
	        }
	    }
	};

	function getDirective(key) {
	    key = key.replace(/^q-/, '');

	    return directives[key];
	}

	function enhancer(obj, proto) {
	    proto && util.extend(proto, {
	        getDirective: getDirective
	    });
	}

	module.exports = enhancer;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var domUtil = __webpack_require__(4);

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
	    var newFree = newMap.free;
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
	            children.push(freeIndex < newFree.length ? (oldFree[freeIndex] || null) : null);
	            freeIndex++;
	        }
	        i++;
	    }

	    // console.log('>>> children:', children);
	    var simulateList = children.slice(0);

	    // remove items no longer exist
	    var removeCount = 0;
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
	                        remove(patches, i);
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

	    var p;
	    i = 0;
	    while (j < simulateList.length) {
	        simulateItem = simulateList[j++];
	        simulateItemKey = getItemKey(simulateItem, key);
	        if (!simulateItemKey) {
	            if (i >= patches.length) break;
	            while (i < patches.length) {
	                p = patches[i++];
	                if (p.type === listDiff.INSERT && !p.item) {
	                    p.item = simulateItem;
	                    break;
	                }
	            }
	        }
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * dom.js
	 * the operators of dom
	 * which is abstracted for isomorphism
	 * @author  longyiyiyu
	 * 
	 */

	var impl = __ENV__ === 'B' ? __webpack_require__(5) : __webpack_require__(6);

	function getDomTree(el) {
	    return impl.getDomTree(el);
	}

	function getDomString(el) {
	    return impl.getDomString(el);
	}

	function getInnerHtml(el) {
	    return impl.getInnerHtml(el);
	}

	function setInnerHtml(el, html) {
	    return impl.setInnerHtml(el, html);
	}

	function setText(el, text) {
	    return impl.setText(el, text);
	}

	function getNodeName(el) {
	    return impl.getNodeName(el);
	}

	function getNodeType(el) {
	    return impl.getNodeType(el);
	}

	function getParentNode(el) {
	    return impl.getParentNode(el);
	}

	function getChildNodes(el) {
	    return impl.getChildNodes(el);
	}

	function getAttributes(el) {
	    return impl.getAttributes(el);
	}

	function getAttribute(el, key) {
	    return impl.getAttribute(el, key);
	}

	function setAttribute(el, key, value) {
	    return impl.setAttribute(el, key, value);
	}

	function addClass(el, c) {
	    return impl.addClass(el, c);
	}

	function removeClass(el, c) {
	    return impl.removeClass(el, c);
	}

	function replaceChild(el, n, o) {
	    return impl.replaceChild(el, n, o);
	}

	function removeChild(el, n) {
	    return impl.removeChild(el, n);
	}

	function getClassName(el) {
	    return impl.getClassName(el);
	}

	function setClassName(el, nc) {
	    return impl.setClassName(el, nc);
	}

	function getStyle(el, key) {
	    return impl.getStyle(el, key);
	}

	function setStyle(el, k, v) {
	    return impl.setStyle(el, k, v);
	}

	function setValue(el, v) {
	    return impl.setValue(el, v);
	}

	function addEventListener(el, type, cb, useCapture) {
	    return impl.addEventListener(el, type, cb, useCapture);
	}

	module.exports = {
	    getDomTree: getDomTree,
	    getDomString: getDomString,
	    getInnerHtml: getInnerHtml,
	    setInnerHtml: setInnerHtml,
	    setText: setText,
	    getNodeType: getNodeType,
	    getNodeName: getNodeName,
	    getParentNode: getParentNode,
	    getChildNodes: getChildNodes,
	    getAttributes: getAttributes,
	    getAttribute: getAttribute,
	    setAttribute: setAttribute,
	    addClass: addClass,
	    removeClass: removeClass,
	    replaceChild: replaceChild,
	    removeChild: removeChild,
	    getClassName: getClassName,
	    setClassName: setClassName,
	    getStyle: getStyle,
	    setStyle: setStyle,
	    setValue: setValue,
	    addEventListener: addEventListener
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	var div = document.createElement('div');
	var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var _slice = [].slice;

	module.exports = {
	    getDomTree: function(html) {
	        var dom;

	        // 简单实现，要考虑特殊标签的话，请参考zepto的实现
	        // A special case optimization for a single tag
	        if (singleTagRE.test(html)) dom = [$(document.createElement(RegExp.$1))];
	        if (!dom) {
	            div.innerHTML = '' + html;
	            dom = _slice.call(div.childNodes, 0);
	        }

	        return dom;
	    },
	    getDomString: function(el) {
	        return el.outerHTML;
	    },
	    getInnerHtml: function(el) {
	        return el.innerHTML;
	    },
	    setInnerHtml: function(el, html) {
	        return (el.innerHTML = html);
	    },
	    setText: function(el, text) {
	        return (el.innerText = text);
	    },
	    getNodeType: function(el) {
	        return el.nodeType;
	    },
	    getNodeName: function(el) {
	        return el.nodeName.toLowerCase();
	    },
	    getParentNode: function(el) {
	        return el.parentNode;
	    },
	    getChildNodes: function(el) {
	        return _slice.call(el.childNodes, 0);
	    },
	    getAttributes: function(el) {
	        return el.attributes;
	    },
	    getAttribute: function(el, key) {
	        return el.getAttribute(key);
	    },
	    setAttribute: function(el, key, value) {
	        return el.setAttribute(key, value);
	    },
	    addClass: function(el, cls) {
	        if (el.classList) {
	            el.classList.add(cls);
	        } else {
	            var cur = ' ' + (el.className || '') + ' ';
	            if (cur.indexOf(' ' + cls + ' ') < 0) {
	                el.className = (cur + cls).trim();
	            }
	        }
	    },
	    removeClass: function(el, cls) {
	        if (el.classList) {
	            el.classList.remove(cls);
	        } else {
	            var cur = ' ' + (el.className || '') + ' ',
	                tar = ' ' + cls + ' ';
	            while (cur.indexOf(tar) >= 0) {
	                cur = cur.replace(tar, ' ');
	            }
	            el.className = cur.trim();
	        }
	    },
	    replaceChild: function(el, n, o) {
	        return el.replaceChild(n, o);
	    },
	    removeChild: function(el, n) {
	        return el.removeChild(n);
	    },
	    getClassName: function(el) {
	        return el.className;
	    },
	    setClassName: function(el, cn) {
	        el.className = cn;
	    },
	    getStyle: function(el, k) {
	        return el.currentStyle ?
	            el.currentStyle[k] :
	            getComputedStyle(el, null)[k];
	    },
	    setStyle: function(el, k, v) {
	        el.style[k] = v;
	    },
	    setValue: function(el, v) {
	        if (el.type === 'checkbox') {
	            el.checked = !!v;
	        } else {
	            el.value = v;
	        }
	    },
	    addEventListener: function(el, type, cb, useCapture) {
	        el.addEventListener(type, cb, useCapture);
	    },
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = {
	    getDomTree: function(html) {
	    },
	    getNodeType: function(el) {
	    },
	    getNodeName: function(el) {
	    },
	    getChildNodes: function(el) {
	    },
	    getAttributes: function(el) {
	    }
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * component.js
	 * the factory function of component class
	 * @author  longyiyiyu
	 * 
	 */

	var tmpl = __webpack_require__(8);
	var util = __webpack_require__(3);
	var domUtil = __webpack_require__(4);
	var dc = __webpack_require__(9);
	var ev = __webpack_require__(10);
	var m = __webpack_require__(11);

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
	    update: function(props, should) {
	        var self = this;
	        var shouldUpdate;

	        if (typeof props !== 'object') {
	            return;
	        }

	        // console.log('>>> update:', props);
	        props && this.trigger('update', props);
	        if (should === true) {
	            shouldUpdate = true;
	        } else if (should === false) {
	            shouldUpdate = false;
	        } else {
	            if (this.shouldComponentUpdate) {
	                shouldUpdate = this.shouldComponentUpdate(props);
	            } else {
	                shouldUpdate = true;
	            }
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

	var repeatBasePrototye = util.extend({}, basePrototype, {
	    update: function(props) {
	        console.log('>>> repeat item update:', props);
	        util.extend(this, props);
	        this.dc();
	    }
	});

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
	        ret[util.camelize(k)] = v;
	    }, util.retTrue);

	    return r ? ret : null;
	}

	/*
	 * build component obj from its class
	 */
	function buildComponent(C, c, isRepeat) {
	    c._html = C._html;
	    c.children = [];
	    c.optMap = {};

	    dc(c, null, C);
	    !isRepeat && ev(c);
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
	var component = function(html, prototype, css, isRepeat) {
	    var self = this;
	    var root = domUtil.getDomTree(html)[0];
	    var comName = domUtil.getNodeName(root);
	    var temp;

	    console.log('>>> component1:', html, comName, isRepeat);

	    var clazz = function(innerHtml, props) {
	        var that = this;
	        var innerDom;
	        var innerYieldMap;

	        console.log('>>> new clazz:', clazz.comName, innerHtml, props, isRepeat);

	        if (typeof innerHtml === 'object' && !props) {
	            props = innerHtml;
	            innerHtml = '';
	        }

	        buildComponent(clazz, this, isRepeat);

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
	                // TODO: for repeat
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
	                                id = that.watch(p, self.getDirective('child'));
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
	                                    self.getDirective(k).call(this, nv, this.optMap[w.id].el, w);
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

	        !isRepeat && this.trigger('init');

	        util.extend(this, this.defaultProps);
	        if (props) {
	            this.update(props);
	        }
	    };

	    // enhance clazz
	    dc(null, clazz.prototype);
	    !isRepeat && ev(null, clazz.prototype);
	    !isRepeat && m(null, clazz.prototype);

	    // clazz itself must have capacity of dc
	    dc(clazz, clazz);

	    // TODO: 是否需要预处理？
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
	            // TODO: for repeat
	            return true;
	        } else {
	            if (C) {
	                p = getPropsObj(dom);
	                if (p) {
	                    ids.push(clazz.watch(p, self.getDirective('child')));
	                }

	                domUtil.setAttribute(dom, ID_KEY, ids.length ? JSON.stringify(ids) : 1);
	                return false;
	            } else {
	                util.scan(dom, function(k, v) {
	                    ids.push(clazz.watch(v, function(nv, w) {
	                        self.getDirective(k).call(this, nv, this.optMap[w.id].el, w);
	                    }));
	                });
	            }

	            domUtil.setAttribute(dom, ID_KEY, ids.length ? JSON.stringify(ids) : 1);
	        }
	    });

	    prototype = prototype || {};

	    // 扩展 statics
	    util.extend(clazz, {
	        comName: isRepeat ? '' : comName,
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
	    util.extend(clazz.prototype, isRepeat ? repeatBasePrototye : basePrototype, prototype);

	    // 注册组件
	    !isRepeat && this.setComClass(comName, clazz);

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
	        repeatItem: repeatItem,
	        component: component,
	        setComClass: setComClass,
	        getComClass: getComClass
	    });
	}

	module.exports = enhancer;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * a template engine
	 * @version 0.0.1
	 * @see https://github.com/riot/tmpl
	 * 
	 */

	var _cache = {};

	/**
	 * The exposed tmpl function returns the template value from the cache, render with data.
	 *
	 * @param   {string} str  - Expression or template with zero or more expressions
	 * @param   {Object} data - A Tag instance, for setting the context
	 * @returns {*} Raw value of the expression or template to render
	 * @private
	 */
	function _tmpl(str, data) {
	    if (!str) return str; // catch falsy values here

	    return _tmpl.compile(str).call(data, _logErr);
	}

	_tmpl.compile = function(str) {
	    if (!str) return str;

	    return _cache[str] || (_cache[str] = _create(str));
	};

	_tmpl.errorHandler = null;

	/**
	 * Output an error message through the `_tmpl.errorHandler` function.
	 *
	 * @param {Error}  err - The Error instance generated by the exception
	 * @param {object} ctx - The context
	 * @private
	 */
	function _logErr(err, ctx) {
	    if (_tmpl.errorHandler) {
	        _tmpl.errorHandler(err);
	    }
	}

	/**
	 * Creates a function instance to get a value from the received template string.
	 *
	 * It'll halt the app if the expression has errors (Parse Error or SyntaxError).
	 *
	 * @param {string} str - The template. Can include zero or more expressions
	 * @returns {Function} An instance of Function with the compiled template.
	 * @private
	 */
	function _create(str) {
	    var expr = _getTmpl(str);

	    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr;

	    // if (arguments.length > 1) console.log('--- getter:\n    `' + expr + '`\n---');

	    // Now, we can create the function to return by calling the Function constructor.
	    // The parameter `E` is the error handler for runtime only.
	    return new Function('E', expr + ';'); //eslint-disable-line no-new-func
	}

	var CH_IDEXPR = '\u2057',
	    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
	    S_QBLOCKS = R_STRINGS.source + '|' +
	    /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
	    /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
	    // RE_CSNAME = /(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/,
	    RE_QBLOCK = new RegExp(S_QBLOCKS, 'g'),
	    RE_DQUOTE = /\u2057/g,
	    RE_QBMARK = /\u2057(\d+)~/g;

	// istanbul ignore next: not both
	var // eslint-disable-next-line max-len
	    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
	    JS_VARNAME = /[,{][$\w]+(?=:)|(:|^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|JSON|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
	    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

	var RE_BREND = {
	    '(': /[()]/g,
	    '[': /[[\]]/g,
	    '{': /[{}]/g
	};

	/**
	 * Parses an expression
	 *
	 * @param   {string} str - Raw template string, without comments
	 * @returns {string} Processed template, ready for evaluation.
	 * @private
	 */
	function _getTmpl(str) {
	    var qstr = []; // hidden qblocks
	    var expr;

	    str = str.replace(RE_DQUOTE, '"');
	    expr = _parseExpr(str, qstr);

	    // Restore quoted strings and regexes
	    if (qstr[0]) {
	        expr = expr.replace(RE_QBMARK, function(_, pos) {
	            return qstr[pos]
	                .replace(/\r/g, '\\r')
	                .replace(/\n/g, '\\n');
	        });
	    }

	    return expr;
	}

	/**
	 * Parses an individual expression `{expression}` or shorthand `{name: expression, ...}`
	 *
	 * For shorthand names, riot supports a limited subset of the full w3c/html specs of
	 * non-quoted identifiers (closer to CSS1 that CSS2).
	 *
	 * The regex used for recognition is `-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*`.
	 *
	 * This regex accepts almost all ISO-8859-1 alphanumeric characters within an html
	 * identifier. Doesn't works with escaped codepoints, but you can use Unicode code points
	 * beyond `\u00FF` by quoting the names (not recommended).
	 *
	 * @param   {string} expr   - The expression, without brackets
	 * @param   {Array}  qstr   - Where to store hidden quoted strings and regexes
	 * @returns {string} Code to evaluate the expression.
	 * @see {@link http://www.w3.org/TR/CSS21/grammar.html#scanner}
	 *      {@link http://www.w3.org/TR/CSS21/syndata.html#tokenization}
	 * @private
	 */
	function _parseExpr(expr, qstr) {
	    var tb;

	    expr = expr
	        .replace(RE_QBLOCK, function(s, div) { // hide strings & regexes
	            return s.length > 2 && !div ? CH_IDEXPR + (qstr.push(s) - 1) + '~' : s;
	        })
	        .replace(/\s+/g, ' ').trim()
	        .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

	    // console.log('>>> [_wrapExpr]', expr, key);
	    expr = expr.replace(JS_VARNAME, function(match, p, mvar, pos, s) {
	        // console.log('>>> [_wrapExpr1]', match, p, mvar, pos, s);
	        if (mvar) {
	            pos = tb ? 0 : pos + match.length; // check only if needed

	            // this, window, and global needs try block too
	            if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
	                match = p + '("' + mvar + JS_CONTEXT + mvar;
	                if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '[';
	            } else if (pos) {
	                tb = !JS_NOPROPS.test(s.slice(pos)); // needs try..catch block?
	            }
	        }
	        return match;
	    });

	    if (tb) {
	        expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
	    }

	    return expr;
	}

	module.exports = _tmpl;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dc.js
	 * about dirty check
	 * @author  longyiyiyu
	 * 
	 */

	var tmpl = __webpack_require__(8);
	var util = __webpack_require__(3);

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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * event.js
	 * the functions of event
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);

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
	            fn((~indx ? name.substring(0, indx) : name).trim(), (~indx ? name.slice(indx + 1).trim() : null));
	        }
	    }
	}

	/*
	 * 注册事件
	 * @param   { String }  events  事件类型，支持多事件与命名空间，比如：'a.ns1 b.ns1'
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
	        (self.events[t] = self.events[t] || []).push(cb);
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
	    if (!arr) return;
	    for (var i = 0, fn; fn = arr[i]; ++i) {
	        if (cb === fn || ns && fn.ns === ns) {
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
	 * @param   { String }  events  事件类型，支持多事件与命名空间，比如：'a.ns1 b.ns1'
	 * @param   {Function}  cb      事件回调
	 * @return  { Object }  this
	 * 
	 */
	function one(events, cb) {
	    var self = this;

	    onEachEvent(events, function(t, ns) {
	        var es = t + (ns ? '.' + ns : '');
	        var f = function() {
	            self.off(es, f);
	            cb.apply(self, arguments);
	        };

	        self.on(es, f);
	    });

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
	        fns = (self.events[t] || []).slice(0);
	        args[0] = {
	            type: t
	        };
	        for (var i = 0, fn; fn = fns[i]; ++i) {
	            fn.apply(self, args);
	            if (fns[i] !== fn) { // for one time function
	                i--;
	            }
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * mixin.js
	 * the functions of mixin
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);
	var cache = {};

	/*
	 * mixin 
	 * main function for exports
	 * @param   {String}            name        name of mixin
	 * @param   {Object|Function}   m           mixin
	 *
	 * @example
	 *
	 * // set the mixin
	 * obj.mixin('a', mix);
	 *
	 * // use the mix of 'a'
	 * obj.mixin('a');
	 *
	 * // use function as mix
	 * obj.mixin(function() {});
	 *
	 * // use object as mix
	 * obj.mixin({});
	 *
	 * // use some mixin
	 * obj.mixin(['a', function() {}, {}]);
	 * 
	 */
	function mixin(name, m) {
	    if (typeof name !== 'string') {
	        m = name;
	        name = null;
	    }

	    if (name && m) { // set
	        if (typeof m === 'object' || typeof m === 'function') {
	            cache[name] = m;
	        }
	        return this;
	    }

	    if (!m && typeof name === 'string') {
	        m = cache[name];
	    }

	    if (!m) {
	        return this;
	    }

	    if (!(m instanceof Array)) {
	        m = [m];
	    }

	    var mix;

	    for (var i = 0, l = m.length; i < l; ++i) {
	        mix = m[i];
	        if (typeof mix === 'string') {
	            mix = cache[mix];
	        }

	        if (mix) {
	            if (typeof mix === 'object') {
	                if (mix.init) {
	                    mix.init(this);
	                    delete mix.init;
	                }

	                util.extend(this, mix);
	            } else if (typeof mix === 'function') {
	                mix(this);
	            }
	        }
	    }

	    return this;
	}

	function enhancer(obj, proto) {
	    proto && util.extend(proto, {
	        mixin: mixin
	    });
	}

	module.exports = enhancer;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * repeat.js
	 * the functions of repeat
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);
	var domUtil = __webpack_require__(4);
	var Pool = __webpack_require__(13);
	var Q = __webpack_require__(1);

	/*
	 * update the Repeat component
	 * prototype method of Repeat component class
	 * @param   {Array}    list         更新的列表
	 * 
	 */
	function update(list) {

	}

	/*
	 * Repeat component class, internal class
	 * @param   {String}    innerHtml   需要repeat的html片段
	 * @param   {Array}     list        初始属性
	 * 
	 */
	function Repeat(innerHtml, list) {
	    this.root = this.ref = document.createComment('q-repeat');

	    // 预编译 item class
	    this.itemClass = Q.component(innerHtml, null, null, true);
	    this.pool = new Pool(this.itemClass);
	    this.items = [];

	    list && this.update(list);
	}

	// 扩展 prototype
	util.extend(Repeat.prototype, {
	    update: update,
	    getDom: function() {
	        return this.root;
	    },
	    getHtml: function() {
	        return domUtil.getDomString(this.root);
	    },
	});

	function enhancer(obj, proto) {
	    proto && util.extend(proto, {
	        Repeat: Repeat
	    });
	}

	module.exports = enhancer;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * componentPool.js
	 * a pool of components
	 * which components must use new to create
	 * and use destroy to release
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);

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


/***/ }
/******/ ]);