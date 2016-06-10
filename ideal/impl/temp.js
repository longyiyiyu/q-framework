// components/myCom.js
var Q = require('Q');

module.exports = Q.component('<mycom></mycom>', {
    init: function() {}
});



// Usage
var MyCom = require('components/myCom');

var myCom = new MyCom('<mycom></mycom>');

// 通过 props 更新，建议只在外部调用
myCom.update({
    prop1: 1
});

// 通过 state 更新，可以内外使用
myCom.setState({
    state1: 1
});

// 获取 dom tree 
var dom = myCom.getDom();


// 通过构建分析得出依赖
require('innerCom1');
// ...

// 1. 下面挂在Q下面的方法都是util，不一定挂在Q
// 2. 因为有yield，所以一个组件对象由两部分的html组成：
//    - 组件本身的html，亦即com/main.html
//    - 初始化组件时的yield
//    
// @param   {String}    html        组件的html资源
// @param   {String}    prototype   扩展组件类的prototype，从组件的js资源中构建获得
// @param   {String}    statics     扩展组件类的statics，从组件的js资源中构建获得
// @param   {String}    css         组件的css资源
// @return  {Class}     component   组件类
Q.component = function(html, prototype, statics, css) {
    var self = this; // 公共资源不要挂在类工厂上，要挂在clazz上，这样可以减少一层闭包

    // 预处理 html, 因为 html 是共有的，所以可以预处理expression，让expression也共享
    // 预处理的资源挂在self（类工厂）上面
    walk(html, function(dom) {
        if (dom.type === 'custom') {
            // 子组件
            // 组件的输入是props
            var p = Q.getProps(dom);

            // 注意这里的watcher的第2个参数是c
            // watcher不能依赖html和dom这些共享资源
            self.buildWatcher(Q.makeExpr(p), function(np, c) {
                c.update(np);
            });
        } else {
            // q-* 处理
            scan(dom, function(k, v) {
                self.buildWatcher(Q.makeExpr(v), Q.getDirective(k));
            });
        }
    });

    var clazz = function(innerHtml, props) {
        var that = this;

        // 把公共资源复制一份到组件对象上
        self.buildComponent(this);

        // 替换yield
        this.replaceInnner(innerHtml);

        // 1. 解析innerHtml部分
        // 2. 给watcher加上element
        walk(this.html, function(dom) {
            var watcher;

            if (dom.type === 'custom') {
                var p = Q.getProps(dom, true);
                var child = new Q.getComponentClass(dom.name)(dom.innerHtml, p);

                that.children.push(child);
                if (dom.refId) {
                    watcher = self.watcherMap[dom.refId];
                } else {
                    watcher = self.buildWatcher(Q.makeExpr(p), function(np, c) {
                        c.update(np);
                    });
                    that.watchers.push(watcher);
                }

                watcher.element = child;
            } else {
                if (dom.refId) {
                    watcher = self.watcherMap[dom.refId];
                    watcher.element = dom;
                } else {
                    scan(dom, function(k, v) {
                        watcher = self.buildWatcher(Q.makeExpr(v), Q.getDirective(k));
                        watcher.element = dom;
                        that.watchers.push(watcher);
                    });
                }
            }
        });
    };

    // 扩展prototype
    Q.extendComponentClass(clazz, prototype, statics);
    // 处理css
    Q.processCss(css);

    return clazz;
};

Q.component.prototype.buildWatcher = function(expr, trigger) {
    var watcher = {
        id: Q.getId(),
        expr: expr,
        trigger: trigger
    };

    this.watcherMap[watcher.id] = watcher;
    this.watchers.push(watcher);

    return watcher;
};
