module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <p class="test1" q-if="exist1">Hello world</p>\
            <p class="test2" q-if="exist2">Hello world</p>\
            <button class="test3" q-if="exist3" q-on="events"></button>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'if-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@if', function() {
        beforeEach(function() {
            com.update({
                exist1: '',
                exist2: '',
                exist3: '',
                events: ''
            });
        });

        it('should able to use if directive', function() {
            com.update({
                exist1: false
            });

            $('#if-test .test1').length.should.equal(0);

            com.update({
                exist1: true
            });

            $('#if-test .test1').length.should.equal(1);
        });

        it('should able to use non boolean value', function() {
            com.update({
                exist2: 0
            });

            $('#if-test .test2').length.should.equal(0);

            com.update({
                exist2: 'aa'
            });

            $('#if-test .test2').length.should.equal(1);
        });

        it('should just click one time for if directive', function(done) {
            var clickTime = 0;

            com.update({
                exist3: false,
                events: {
                    click: function() {
                        clickTime++;
                    }
                }
            });

            $('#if-test .test3').length.should.equal(0);

            com.update({
                exist3: true
            });

            $('#if-test .test3').length.should.equal(1);
            $('#if-test .test3')[0].click();

            setTimeout(function() {
                clickTime.should.be.equal(1);
                done();
            }, 100);

        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
