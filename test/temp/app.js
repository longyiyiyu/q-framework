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

	var MyCom = Q.component('<myCom><h1 q-text="title"></h1><p q-text="summary" q-class="{big: isBig}"></p></myCom>');

	console.log('new com:', new MyCom());

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
	__webpack_require__(2)(Q);

	// enhance component
	__webpack_require__(7)(Q);

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

	function getDirective(key) {
	    console.log('>>> getDirective:', key);
	}

	function enhancer(obj) {
	    util.extend(obj, {
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

	        if (r !== false) {
	            children = domUtil.getChildNodes(el);
	            if (children.length) {
	                walk(children, cb);
	            }
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

	var reHasYield = /<yield\b/i;
	var reYieldAll = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
	var reYieldSrc = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
	var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;

	function replaceYields(html, innerHtml) {
	    if (typeof html !== 'stirng') return html;

	}

	module.exports = {
	    getId: getId,
	    walk: walk,
	    scan: scan,
	    extend: extend,
	    replaceYields: replaceYields,
	    noop: function() {},
	    retTure: function() {
	        return true;
	    },
	    retFalse: function() {
	        return false;
	    }
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

	function getNodeName(el) {
	    return impl.getNodeName(el);
	}

	function getNodeType(el) {
	    return impl.getNodeType(el);
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

	module.exports = {
	    getDomTree: getDomTree,
	    getDomString: getDomString,
	    getInnerHtml: getInnerHtml,
	    getNodeType: getNodeType,
	    getNodeName: getNodeName,
	    getChildNodes: getChildNodes,
	    getAttributes: getAttributes,
	    getAttribute: getAttribute,
	    setAttribute: setAttribute
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
	    getNodeType: function(el) {
	        return el.nodeType;
	    },
	    getNodeName: function(el) {
	        return el.nodeName.toLowerCase();
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
	    }
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
	var yd = __webpack_require__(10);

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

	    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr);
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
	    } else if (typeof expr === 'object') {}
	}

	/*
	 * dirty check
	 */
	function dc() {
	    var w;
	    var v;

	    for (var i = 0, l = this.watchers.length; i < l; ++i) {
	        w = this.watchers[i];
	        v = w.expr.call(this/* , function err(err, ctx) {} */);
	        if (this.valueMap[w.id] !== v) {
	            w.trigger.call(this, v, w);
	            this.valueMap[w.id] = v;
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

	function enhancer(obj, ori) {
	    ori = ori || {};
	    util.extend(obj, {
	        valueMap: {},
	        watcherMap: util.extend({}, ori.watcherMap),
	        watchers: ori.watchers ? ori.watchers.slice() : [],
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
	 * yield.js
	 * about processing yield blocks
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);
	var domUtil = __webpack_require__(4);

	function setYield(dom) {
	    var f = domUtil.getAttribute(dom, 'from');

	    this.yieldMap[f] = this.yieldMap[f] || dom;
	}

	function enhancer(obj) {
	    util.extend(obj, {
	        yieldMap: {},
	        setYield: setYield
	    });
	}

	module.exports = enhancer;

/***/ }
/******/ ]);