module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <button class="test1" q-on="events1">hello</button>\
            <button class="test2" q-on="events2">hello</button>\
            <button class="test3" q-on="events3">hello</button>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'on-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@on', function() {
        beforeEach(function() {
            com.update({
                events1: '',
                events2: ''
            });
        });

        it('should able bind events', function(done) {
            var $btn = $('#on-test .test1');
            var clickTime = 0;
            var focusTime = 0;

            com.update({
                events1: {
                    click: function() {
                        clickTime++;
                    },
                    focus: function() {
                        focusTime++;
                    }
                }
            });

            // just button has click method in phantomjs
            // https://github.com/ariya/phantomjs/issues/10795
            $btn[0].click();
            $btn[0].focus();

            setTimeout(function() {
                clickTime.should.be.eql(1);
                focusTime.should.be.eql(1);
                done();
            }, 100);
        });

        it('should get the component by this pointer in callback', function(done) {
            var $btn = $('#on-test .test2');

            com.update({
                events2: {
                    click: function() {
                        this.should.be.equal(com);
                        done();
                    }
                }
            });

            $btn[0].click();
        });

        it('should not change the event binding when updating', function(done) {
            var $btn = $('#on-test .test3');
            var clickTime1 = 0;
            var clickTime2 = 0;

            com.update({
                events3: {
                    click: function() {
                        clickTime1++;
                    }
                }
            });

            $btn[0].click();

            setTimeout(function() {
                clickTime1.should.be.eql(1);

                com.update({
                    events3: {
                        click: function() {
                            clickTime2++;
                        }
                    }
                });

                $btn[0].click();

                setTimeout(function() {
                    clickTime1.should.be.eql(2);
                    clickTime2.should.be.eql(0);
                    done();
                }, 100);
            }, 100);
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
