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
    insertBefore: function(el, n, o) {
        return el.insertBefore(n, o);
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
