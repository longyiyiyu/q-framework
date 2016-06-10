/*
 * dom.js
 * the operators of dom
 * which is abstracted for isomorphism
 * @author  longyiyiyu
 * 
 */

var impl = require('../browser/dom');

function getDomTree(el) {
    return impl.getDomTree(el);
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

module.exports = {
    getDomTree: getDomTree,
    getNodeType: getNodeType,
    getChildNodes: getChildNodes,
    getAttributes: getAttributes
};