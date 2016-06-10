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

	var Q = __webpack_require__(1);

	var MyCom = Q.component('<myCom><h1 q-text="title"></h1><p q-text="summary" q-class="{big: isBig}"></p></myCom>');


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

	module.exports = {
	    version: '2.0.0',
	    component: __webpack_require__(2)
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * component.js
	 * the factory function of component class
	 * @author  longyiyiyu
	 * 
	 */

	var util = __webpack_require__(3);

	/*
	 * component 
	 * main function for exports
	 * @param   {String}    html        组件的html资源
	 * @param   {String}    prototype   扩展组件类的prototype，从组件的js资源中构建获得
	 * @param   {String}    static      扩展组件类的static，从组件的js资源中构建获得
	 * @param   {String}    css         组件的css资源
	 * @return  {Class}     component   组件类
	 * 
	 */
	var component = function(html, prototype, static, css) {
	    console.log('>>> component1:', html);
	};

	util.extend(component, {
	});

	module.exports = component;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var domUtil = __webpack_require__(4);

	function walk(doms, cb) {
	    var el;
	    var children;

	    if (!doms.length) {
	        doms = [doms];
	    }

	    for (var i = 0, l = doms.length; i < l; ++i) {
	        el = doms[i];
	        if (domUtil.getNodeType(el) === 1) {
	            cb(el);
	        }

	        children = domUtil.getChildNodes(el);
	        if (children.length) {
	            walk(children, cb);
	        }
	    }
	}

	function scan(dom, cb) {
	    var atts = domUtil.getAttributes(dom);
	    var res = [];

	    for (var i = 0, l = atts.length; i < l; ++i) {
	        if (atts[i].name.indexOf('q-') === 0) {
	            res.push({
	                name: atts[i].name,
	                value: atts[i].value
	            });
	        }
	    }

	    if (res.length) {
	        cb(res);
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

	module.exports = {
	    walk: walk,
	    scan: scan,
	    extend: extend
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

	var impl = __webpack_require__(5);

	function getNodeType(el) {
	    return impl.getNodeType(el);
	}

	function getChildNodes(el) {
	    return impl.getChildNodes(el);
	}

	function getAttributes(el) {
	    return impl.getAttributes(el);
	}

	module.exports = {
	    getNodeType: getNodeType,
	    getChildNodes: getChildNodes,
	    getAttributes: getAttributes
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	
	module.exports = {
	    getNodeType: function(el) {
	        return el.nodeType;
	    },
	    getChildNodes: function(el) {
	        return [].slice.call(el.childNodes, 0);
	    },
	    getAttributes: function(el) {
	        return el.attributes;
	    }
	};

/***/ }
/******/ ]);