var div = document.createElement('div');
var singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
var _slice = [].slice;


module.exports = {
    getDomTree: function(html) {
        var dom;

        // 简单实现，要考虑特殊标签的话，请参考zepto的实现
        // A special case optimization for a single tag
        if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));
        if (!dom) {
            div.innerHTML = '' + html;
            dom = _slice.call(div.childNodes, 0);
        }

        return dom;
    },
    getNodeType: function(el) {
        return el.nodeType;
    },
    getChildNodes: function(el) {
        return _slice.call(el.childNodes, 0);
    },
    getAttributes: function(el) {
        return el.attributes;
    }
};
