module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <input type="checkbox" class="test1" q-value="checkboxValue" />\
            <input type="text" class="test2" q-value="inputValue" />\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'value-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@value', function() {
        beforeEach(function() {
            com.update({
                checkboxValue: '',
                inputValue: ''
            });
        });

        it('should set the checkbox', function() {
            var $cb = $('#value-test .test1');

            $cb[0].checked.should.be.equal(false);

            com.update({
                checkboxValue: 1
            });
            $cb[0].checked.should.be.equal(true);
        });

        it('should set the input value', function() {
            var $input = $('#value-test .test2');

            $input[0].value.should.be.equal('');

            com.update({
                inputValue: 'Hello'
            });
            $input[0].value.should.be.equal('Hello');
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
