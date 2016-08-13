module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <ul class="test1">\
                <li q-repeat="list1" q-text="msg"></li>\
            </ul>\
            <div>\
                <div class="test2" q-repeat="list2">\
                    <p class="test2-1" q-repeat="list" q-text="text"></p>\
                </div>\
            </div>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'repeat-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@repeat', function() {
        beforeEach(function() {
            com.update({
                list1: [],
                list2: [],
                list3: [],
            });
        });

        it('should able to use repeat', function() {
            com.update({
                list1: [{
                    msg: 'hello'
                }, {
                    msg: 'world'
                }]
            });

            var items = $('#repeat-test .test1 li');
            items.length.should.equal(2);
            items[0].textContent.should.equal('hello');
            items[1].textContent.should.equal('world');
        });

        it('should able to use nested repeat', function() {
            com.update({
                list2: [{
                    list: [{
                        text: 'hello'
                    }, {
                        text: 'world'
                    }]
                }, {
                    list: [{
                        text: 'hello'
                    }, {
                        text: 'qq'
                    }]
                }]
            });

            var divs = $('#repeat-test .test2');
            var ps;

            divs.length.should.equal(2);
            ps = divs.eq(0).find('.test2-1');
            ps[0].textContent.should.equal('hello');
            ps[1].textContent.should.equal('world');

            ps = divs.eq(1).find('.test2-1');
            ps[0].textContent.should.equal('hello');
            ps[1].textContent.should.equal('qq');
        });

        // it('should not throw a error when array is not defined', function() {
        //     new Q({
        //         el: '#tpl3',
        //         data: {
        //             lists: {}
        //         },
        //         filters: {
        //             noresult: function(v) {
        //                 return v['xxx'];
        //             }
        //         }
        //     });
        // });

        // it('should able to use double repeat', function(done) {
        //     var vm = new Q({
        //         el: '#multi-repeat',
        //         data: {
        //             msgs: [{
        //                 text: 'hello'
        //             }, {
        //                 text: 'hello'
        //             }]
        //         }
        //     });

        //     setTimeout(function() {
        //         var ps = $('#multi-repeat div p');
        //         ps.length.should.equal(4);
        //         for (var i = 0, l = ps.length; i < l; i++) {
        //             ps[i].textContent.should.equal('hello');
        //         }
        //         vm.$set('msgs', [{
        //             text: 'nihao'
        //         }, {
        //             text: 'nihao'
        //         }]);

        //         setTimeout(function() {
        //             ps = $('#multi-repeat div p');
        //             ps.length.should.equal(4);
        //             for (var i = 0, l = ps.length; i < l; i++) {
        //                 ps[i].textContent.should.equal('nihao');
        //             }
        //             done();
        //         }, 200);
        //     }, 200);
        // });

        // it('should not throw a error when repeat element has been modified', function(done) {
        //     var container = document.getElementById('tpl1'),
        //         i = 0,
        //         l,
        //         nodes = container.childNodes;
        //     // remove repeat element
        //     for (l = nodes.length; i < l; i++) {
        //         if (nodes[i].tagName === 'LI') {
        //             container.removeChild(nodes[i]);
        //             break;
        //         }
        //     }
        //     tpl1.$set('items', [{
        //         msg: 'hello'
        //     }, {
        //         msg: 'world'
        //     }]);
        //     done();
        // });

    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
