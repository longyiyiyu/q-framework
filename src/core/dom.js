/*
 * dom.js
 * the operators of dom
 * which is abstracted for isomorphism
 * @author  longyiyiyu
 * 
 */

var impl = __ENV__ === 'B' ? require('../browser/dom') : require('../server/dom');

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

function insertBefore(el, n, o) {
    return impl.insertBefore(el, n, o);
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
    insertBefore: insertBefore,
    getClassName: getClassName,
    setClassName: setClassName,
    getStyle: getStyle,
    setStyle: setStyle,
    setValue: setValue,
    addEventListener: addEventListener
};
