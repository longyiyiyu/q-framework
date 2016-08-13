module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <div class="toggle-me" q-class="{\'toggle-me\': toggle}"></div>\
            <div class="test" q-class="classname"></div>\
            <div class="test2" q-class="toggles"></div>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'class-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@class', function() {
        beforeEach(function() {
            com.update({
                toggle: '',
                toggles: '',
                classname: ''
            });
        });

        it('should be able to set a class', function () {
            var $dom = $('#class-test .test');

            com.update({
                classname: 'one'
            });
            $dom.hasClass('one').should.equal(true);

            com.update({
                classname: 'two'
            });
            $dom.hasClass('one').should.equal(false);
            $dom.hasClass('two').should.equal(true);
        });

        it('should be able to toggle class', function () {
            var $dom;

            com.update({
                toggle: true
            });
            $dom = $('#class-test .toggle-me');
            $dom.length.should.equal(1);

            com.update({
                toggle: false
            });
            $dom.hasClass('toggle-me').should.equal(false);
        });

        it('should be able to toggle many classes', function () {
            var $dom = $('#class-test .test2');

            com.update({
                toggles: {
                    'one': true,
                    'two': true
                }
            });
            $dom.hasClass('one').should.equal(true);
            $dom.hasClass('two').should.equal(true);

            com.update({
                toggles: {
                    'one': true,
                    'two': false
                }
            });
            $dom.hasClass('one').should.equal(true);
            $dom.hasClass('two').should.equal(false);
        });
        
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
