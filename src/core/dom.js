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

module.exports = {
    getDomTree: getDomTree,
    getDomString: getDomString,
    getInnerHtml: getInnerHtml,
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
    removeChild: removeChild
};
