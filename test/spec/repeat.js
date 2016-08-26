module.exports = function(Q) {
    var cnt;
    var ComClass;
    var MyComClass;
    var com;
    var innerHtml;
    var mycomHtml =
        '<mycom>\
            <p class="mycom__desc" q-text="text"></p>\
        </mycom>';
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
            <ul class="test3">\
                <li q-repeat="list3" q-text="msg"></li>\
            </ul>\
            <div class="test4">\
                <div>\
                    <p class="test4-1" q-repeat="list4" q-text="text"></p>\
                </div>\
                <div>\
                    <p class="test4-1" q-repeat="list4" q-text="text"></p>\
                </div>\
            </div>\
            <div class="test5">\
                <mycom q-repeat="list5" text="text"></mycom>\
            </div>\
            <div class="test6" q-repeat="list6">\
                <mycom class="test6-1" text="text"></mycom>\
            </div>\
            <div class="test7" q-repeat="list7">\
                <p class="test7-1" q-text="__index"></p>\
            </div>\
            <div class="test8" q-repeat="list8">\
                <p class="test8-1" q-text="this.parent.title + __index"></p>\
            </div>\
            <div class="test9" q-repeat="list9">\
                <p class="test9-1" q-text="text"></p>\
            </div>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'repeat-test';
        document.body.appendChild(cnt);

        MyComClass = Q.component(mycomHtml);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@repeat', function() {
        beforeEach(function() {
            com.update({
                title: '',
                list1: [],
                list2: [],
                list3: [],
                list4: [],
                list5: [],
                list6: [],
                list7: [],
                list8: [],
                list9: []
            });
        });

        it('should be able to use repeat', function() {
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

        it('should be able to use nested repeat', function() {
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

        it('should not throw an error when array is not defined', function() {
            (function() {
                com.update({
                    list3: {}
                });
            }).should.not.be.throw();
        });

        it('should be able to use double repeat', function() {
            com.update({
                list4: [{
                    text: 'hello'
                }, {
                    text: 'hello'
                }]
            });

            var ps = $('#repeat-test .test4-1');
            ps.length.should.be.equal(4);
            for (var i = 0, l = ps.length; i < l; i++) {
                ps[i].textContent.should.equal('hello');
            }

            com.update({
                list4: [{
                    text: 'nihao'
                }, {
                    text: 'nihao'
                }]
            });

            ps = $('#repeat-test .test4-1');
            ps.length.should.equal(4);
            for (i = 0, l = ps.length; i < l; i++) {
                ps[i].textContent.should.equal('nihao');
            }
        });

        it('should be able to repeat a component', function() {
            com.update({
                list5: [{
                    text: 'hello'
                }, {
                    text: 'world'
                }]
            });

            var mycoms = $('#repeat-test .test5 mycom');
            mycoms.length.should.be.equal(2);
            var ps = $('#repeat-test .test5 .mycom__desc');
            ps.length.should.be.equal(2);
        });

        it('should be able to repeat an item which has child component', function() {
            com.update({
                list6: [{
                    text: 'hello'
                }, {
                    text: 'world'
                }]
            });

            var mycoms = $('#repeat-test .test6');
            mycoms.length.should.be.equal(2);
            var ps = $('#repeat-test .test6 .mycom__desc');
            ps.length.should.be.equal(2);
        });

        it('should be able to read the index of repeating by "__index"', function() {
            com.update({
                list7: [{}, {}, {}]
            });

            var ps = $('#repeat-test .test7-1');
            for (var i = 0, l = ps.length; i < l; ++i) {
                ps.eq(i).text().should.be.equal('' + i);
            }
        });

        it('should be able to get the parent component with "this.parent" in repeat item', function() {
            var title = 'hello';

            com.update({
                title: title,
                list8: [{}, {}, {}]
            });

            var ps = $('#repeat-test .test8-1');
            for (var i = 0, l = ps.length; i < l; ++i) {
                ps.eq(i).text().should.be.equal(title + i);
            }
        });

        describe('should be able to change the data', function() {
            var arr;

            beforeEach(function() {
                com.update({
                    list9: [{
                        text: 1
                    }, {
                        text: 2
                    }, {
                        text: 3
                    }]
                });
            });

            it('append', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 1
                    }, {
                        text: 2
                    }, {
                        text: 3
                    }, {
                        text: 4
                    }, {
                        text: 5
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(5);
            });

            it('prepend', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 4
                    }, {
                        text: 5
                    }, {
                        text: 1
                    }, {
                        text: 2
                    }, {
                        text: 3
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(5);
            });

            it('insert', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 1
                    }, {
                        text: 2
                    }, {
                        text: 4
                    }, {
                        text: 5
                    }, {
                        text: 3
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(5);
            });

            it('pop', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 1
                    }, {
                        text: 2
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(2);
            });

            it('shift', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 2
                    }, {
                        text: 3
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(2);
            });

            it('delete', function() {
                $('#repeat-test .test9-1').length.should.be.equal(3);

                com.update({
                    list9: [{
                        text: 1
                    }, {
                        text: 3
                    }]
                });

                $('#repeat-test .test9-1').length.should.be.equal(2);
            });
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
