module.exports = function(Q) {
    var cnt;
    var innerHtml;
    var componentHtml =
        '<com>\
            <h1 class="test" q-text="text"></h1>\
        </com>';

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

        it('should be able to update the component', function() {
            var str = 'Hello';
            var componentHtml =
                '<com>\
                    <h1 class="test4" q-text="text"></h1>\
                </com>';
            var ComClass = Q.component(componentHtml);
            var com = new ComClass(innerHtml);

            cnt.appendChild(com.getDom());

            com.update({
                text: str
            });

            $('#component-test .test4').text().should.be.equal(str);
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
