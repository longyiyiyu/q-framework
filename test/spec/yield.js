module.exports = function(Q) {
    var cnt;

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'yield-test';
        document.body.appendChild(cnt);
    });

    describe('@yield', function() {
        it('should be able to use yield', function() {
            var cntStr = 'Hello';
            var mycomHtml =
                '<mycom>\
                    <h1 q-text="title"></h1>\
                    <yield from="cnt"></yield>\
                </mycom>';
            var MyCom = Q.component(mycomHtml);
            var comHtml =
                '<com>\
                    <mycom title="title" desc="desc">\
                        <yield to="cnt">\
                            <p class="test1" q-text="desc"></p>\
                        </yield>\
                    </mycom>\
                    <p q-text="author"></p>\
                </com>';

            var ComClass = Q.component(comHtml);
            var com = new ComClass();

            cnt.appendChild(com.getDom());

            com.update({
                title: 'Hello world',
                desc: cntStr,
                author: 'Jack'
            });

            $('#yield-test .test1').text().should.be.equal(cntStr);
            cnt.removeChild(com.getDom());
        });

        it('should not affect the component itself when adding yields', function() {
            var str = 'Hello';
            var comHtml =
                '<com>\
                    <p class="test2" q-text="word"></p>\
                </com>';
            var Com = Q.component(comHtml);
            var com = new Com();

            cnt.appendChild(com.getDom());
            com.update({
                word: str
            });

            $('#yield-test .test2').text().should.be.equal(str);
            cnt.removeChild(com.getDom());


            comHtml =
                '<com>\
                    <yield from="top"></yield>\
                    <p class="test2" q-text="word"><yield from="inner"></yield></p>\
                    <yield from="bottom"></yield>\
                </com>';
            Com = Q.component(comHtml);
            com = new Com();

            cnt.appendChild(com.getDom());
            com.update({
                word: str
            });

            $('#yield-test .test2').text().should.be.equal(str);
            cnt.removeChild(com.getDom());
        });

        it('should just silence when the yields are not supported by component', function() {
            var str = 'world';
            var comHtml =
                '<com>\
                    <p class="test3" q-text="word"></p>\
                </com>';
            var innerHtml =
                '<yield to="top"><h2 class="test3-1" q-text="title"></h2></yield>';
            var Com = Q.component(comHtml);
            var com = new Com(innerHtml);

            cnt.appendChild(com.getDom());

            com.update({
                title: 'Hello',
                word: str
            });

            $('#yield-test .test3').text().should.be.equal(str);
            $('#yield-test .test3-1').length.should.be.equal(0);
            cnt.removeChild(com.getDom());
        });

        it('should remove the yield nodes which are not used', function() {
            var str = 'world';
            var comHtml =
                '<com>\
                    <yield from="top"></yield>\
                    <p class="test4" q-text="word"><yield from="inner"></yield></p>\
                    <yield from="bottom"></yield>\
                </com>';
            var Com = Q.component(comHtml);
            var com = new Com();

            cnt.appendChild(com.getDom());

            com.update({
                word: str
            });

            $('#yield-test yield').length.should.be.equal(0);
            cnt.removeChild(com.getDom());
        });

        it('should be able to use nested yield', function() {
            var titleStr = 'Hello world';
            var cntStr = 'Hello';
            var mycom1Html =
                '<mycom1>\
                    <h1 class="test5-1" q-text="title"></h1>\
                    <yield from="cnt"></yield>\
                </mycom1>';
            var MyCom1 = Q.component(mycom1Html);
            var mycom2Html =
                '<mycom2>\
                    <h2 class="test5-2" q-text="title"></h2>\
                    <yield from="cnt"></yield>\
                </mycom2>';
            var MyCom2 = Q.component(mycom2Html);
            var comHtml =
                '<com>\
                    <mycom1 title="title" desc="desc">\
                        <yield to="cnt">\
                            <p class="test5-3" q-text="desc"></p>\
                            <mycom2 title="2 + title" desc="2 + desc">\
                                <yield to="cnt">\
                                    <p class="test5-4" q-text="desc"></p>\
                                </yield>\
                            </mycom2>\
                        </yield>\
                    </mycom1>\
                    <p q-text="author"></p>\
                </com>';

            var ComClass = Q.component(comHtml);
            var com = new ComClass();

            cnt.appendChild(com.getDom());

            com.update({
                title: titleStr,
                desc: cntStr,
                author: 'Jack'
            });

            $('#yield-test .test5-1').text().should.be.equal(titleStr);
            $('#yield-test .test5-2').text().should.be.equal(2 + titleStr);
            $('#yield-test .test5-3').text().should.be.equal(cntStr);
            $('#yield-test .test5-4').text().should.be.equal(2 + cntStr);
            cnt.removeChild(com.getDom());
        });

        it('should be able to use yield in repeat', function() {
            var title = 'Hello world';
            var word = 'test';
            var myComHtml =
                '<mycom>\
                    <yield from="title"></yield>\
                    <div q-repeat="inner" q-class="cls">\
                        <yield from="in"></yield>\
                    </div>\
                </mycom>';
            var MyCom = Q.component(myComHtml);
            var comHtml =
                '<com>\
                    <mycom q-repeat="list" title="title" inner="inner">\
                        <yield to="title">\
                            <h2 class="test6-1" q-text="title"></h2>\
                        </yield>\
                        <yield to="in">\
                            <p class="test6-2" q-text="word"></p>\
                        </yield>\
                    </mycom>\
                </com>';
            var Com = Q.component(comHtml);
            var com = new Com();

            cnt.appendChild(com.getDom());
            com.update({
                list: [{
                    title: title + 1,
                    inner: [{
                        cls: 'green',
                        word: word + 1
                    }, {
                        cls: 'red',
                        word: word + 2
                    }, {
                        cls: 'yellow',
                        word: word + 3
                    }]
                }, {
                    title: title + 2,
                    inner: [{
                        cls: 'green',
                        word: word + 4
                    }, {
                        cls: 'red',
                        word: word + 5
                    }, {
                        cls: 'yellow',
                        word: word + 6
                    }]
                }]
            });

            var $el = $('#yield-test .test6-1');
            $el.length.should.be.equal(2);
            $el.each(function(index, el) {
                $(el).text().should.be.equal(title + (index + 1));
            });

            $el = $('#yield-test .test6-2');
            $el.length.should.be.equal(6);
            $el.each(function(index, el) {
                $(el).text().should.be.equal(word + (index + 1));
            });
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
