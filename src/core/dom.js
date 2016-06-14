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