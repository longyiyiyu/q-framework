module.exports = function(Q) {
    var cnt;
    var innerHtml;

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'component-test';
        document.body.appendChild(cnt);

        // ComClass = Q.component(componentHtml);
        // com = new ComClass(innerHtml);
        // cnt.appendChild(com.getDom());
    });

    describe('@component', function() {
        it('should create a component Class by html string', function() {
            var componentHtml =
                '<com>\
                    <h1 class="test1" q-text="text"></h1>\
                </com>';
            var ComClass = Q.component(componentHtml);
            var com = new ComClass(innerHtml);

            (com instanceof ComClass).should.be.equal(true);
        });

        it('should be able to get a dom tree', function() {
            var str = 'Hello';
            var componentHtml =
                '<com>\
                    <h1 class="test2" q-text="text"></h1>\
                </com>';
            var ComClass = Q.component(componentHtml);
            var com = new ComClass(innerHtml);

            com.update({
                text: str
            });

            $('#component-test .test2').length.should.be.equal(0);

            cnt.appendChild(com.getDom());

            $('#component-test .test2').length.should.be.equal(1);
        });

        // TODO: q-id-p 不应该出现
        // it('should be able to get a dom html string', function() {
        //     var str = 'Hello';
        //     var componentHtml =
        //         '<com>\
        //             <h1 class="test3" q-text="text"></h1>\
        //         </com>';
        //     var ComClass = Q.component(componentHtml);
        //     var com = new ComClass(innerHtml);

        //     com.update({
        //         text: str
        //     });

        //     com.getHtml().should.be.equal('<com>                    <h1 class="test3" q-text="text" q-id-p="[24]">Hello</h1>                </com>');
        // });

        describe('@update', function() {
            var componentHtml =
                '<com>\
                    <h1 class="test4" q-text="text"></h1>\
                </com>';
            var com;

            it('should be able to update the component', function() {
                var str = 'Hello';
                var ComClass = Q.component(componentHtml);

                com = new ComClass();
                cnt.appendChild(com.getDom());

                com.update({
                    text: str
                });

                $('#component-test .test4').text().should.be.equal(str);
            });

            it('should be able to update the component in the updating', function() {
            });

            afterEach(function() {
                cnt.removeChild(com.getDom());
            });
        });

        it('should be able to get the parent component with "this.parent"', function() {
            var title = 'Hello';
            var text = 'World';
            var mycomHtml =
                '<mycom-component>\
                    <p class="mycom__desc" q-text="this.parent.title + \' \' + text"></p>\
                </mycom-component>';
            var MyComClass = Q.component(mycomHtml);
            var componentHtml =
                '<com>\
                    <h1 class="test5" q-text="title"></h1>\
                    <div class="test5-1">\
                        <mycom-component text="text"></mycom-component>\
                    </div>\
                </com>';
            var ComClass = Q.component(componentHtml);
            var com = new ComClass(innerHtml);

            cnt.appendChild(com.getDom());

            com.update({
                title: title,
                text: text
            });

            $('#component-test .test5').text().should.be.equal(title);
            $('#component-test .test5-1 .mycom__desc').text().should.be.equal(title + ' ' + text);
        });

        it('should be able to nest component for more than two layers', function() {
            var title = 'Hello';
            var desc = 'World';
            var com1Html =
                '<com1>\
                    <p class="desc" q-text="desc"></p>\
                </com1>';
            var Com1 = Q.component(com1Html);
            var com2Html =
                '<com2>\
                    <h1 class="title" q-text="title"></h1>\
                    <com1 desc="desc"></com1>\
                </com2>';
            var Com2 = Q.component(com2Html);
            var comHtml =
                '<com>\
                    <div class="test6">\
                        <com2 title="title" desc="desc"></com2>\
                    </div>\
                </com>';
            var Com = Q.component(comHtml);
            var com = new Com(innerHtml);

            cnt.appendChild(com.getDom());
            com.update({
                title: title,
                desc: desc
            });

            $('#component-test .test6 .title').text().should.be.equal(title);
            $('#component-test .test6 .desc').text().should.be.equal(desc);
        });

        describe('@life_cycle', function() {
            var comHtml =
                '<com>\
                    <h1 class="test7" q-text="title"></h1>\
                </com>';

            describe('@init', function() {
                it('should call the init method when the component has inited', function(done) {
                    var ComClass = Q.component(comHtml, {
                        init: function() {
                            done();
                        }
                    });

                    var com = new ComClass();
                });
            });

            describe('@update', function() {
                var com;

                beforeEach(function() {
                    var ComClass = Q.component(comHtml);
                    com = new ComClass();
                    cnt.appendChild(com.getDom());
                });

                it('should trigger the "update" event before the component updating', function(done) {
                    com.on('update', function() {
                        done();
                    });

                    com.update({
                        title: 'Hello'
                    });

                    com.off('update');
                });

                it('should get the data the component updating', function(done) {
                    var data = {
                        title: 'Hello World'
                    };

                    com.on('update', function(e, d) {
                        d.should.be.equal(data);
                        done();
                    });

                    com.update(data);
                    com.off('update');
                });

                it('should be able to change the dom by modifying the data in "update" event', function(done) {
                    var newTitle = 'HaHa';

                    com.on('update', function(e, d) {
                        d.title = newTitle;
                    });

                    com.update({
                        title: 'Hello'
                    });

                    setTimeout(function() {
                        $('#component-test .test7').text().should.be.equal(newTitle);
                        com.off('update');
                        done();
                    }, 500);
                });

                afterEach(function() {
                    cnt.removeChild(com.getDom());
                });
            });

            describe('@shouldComponentUpdate', function() {
                var com;

                it('should call the shouldComponentUpdate method when the component updating', function(done) {
                    var ComClass = Q.component(comHtml, {
                        shouldComponentUpdate: function() {
                            done();
                        }
                    });

                    com = new ComClass();
                    cnt.appendChild(com.getDom());
                    com.update({
                        title: 'Hello'
                    });
                });

                it('should call the shouldComponentUpdate method after the "update" event', function(done) {
                    var hasUpdate = false;
                    var ComClass = Q.component(comHtml, {
                        shouldComponentUpdate: function() {
                            hasUpdate.should.be.equal(true);
                            done();
                        }
                    });

                    com = new ComClass();
                    cnt.appendChild(com.getDom());
                    com.on('update', function() {
                        hasUpdate = true;
                    });

                    com.update({
                        title: 'Hello'
                    });
                    com.off('update');
                });

                it('should stop updating the dom when shouldComponentUpdate return false values', function() {
                    var str1 = 'Hello';
                    var str2 = 'Hello World';
                    var ComClass = Q.component(comHtml, {
                        shouldComponentUpdate: function(d) {
                            if (d.title === str1) return false;
                            return true;
                        }
                    });

                    com = new ComClass();
                    cnt.appendChild(com.getDom());
                    com.update({
                        title: str2
                    });

                    $('#component-test .test7').text().should.be.equal(str2);

                    com.update({
                        title: str1
                    });

                    $('#component-test .test7').text().should.be.equal(str2);
                });

                it('should update the component properties value event though shouldComponentUpdate return false values', function() {
                    var str1 = 'Hello';
                    var str2 = 'Hello World';
                    var ComClass = Q.component(comHtml, {
                        shouldComponentUpdate: function(d) {
                            if (d.title === str1) return false;
                            return true;
                        }
                    });

                    com = new ComClass();
                    cnt.appendChild(com.getDom());
                    com.update({
                        title: str2
                    });

                    $('#component-test .test7').text().should.be.equal(str2);
                    com.title.should.be.equal(str2);

                    com.update({
                        title: str1
                    });

                    $('#component-test .test7').text().should.be.equal(str2);
                    com.title.should.be.equal(str1);
                });

                afterEach(function() {
                    cnt.removeChild(com.getDom());
                });
            });

            describe('@updated', function() {
                var com;

                it('should trigger the "updated" event after the component updating', function(done) {
                    var ComClass = Q.component(comHtml);

                    com = new ComClass();
                    cnt.appendChild(com.getDom());

                    com.on('updated', function() {
                        done();
                    });

                    com.update({
                        title: 'Hello'
                    });
                });

                it('should trigger the "updated" event after the dom has updating', function(done) {
                    var str = 'Hello';
                    var ComClass = Q.component(comHtml);

                    com = new ComClass();
                    cnt.appendChild(com.getDom());

                    com.on('updated', function() {
                        $('#component-test .test7').text().should.be.equal(str);
                        done();
                    });

                    $('#component-test .test7').text().should.be.equal('');
                    com.update({
                        title: str
                    });
                });

                afterEach(function() {
                    cnt.removeChild(com.getDom());
                });
            });
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
