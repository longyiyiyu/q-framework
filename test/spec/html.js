module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <div class="box" q-html="cnt"></div>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'html-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@html', function() {
        beforeEach(function() {
            com.update({
                cnt: ''
            });
        });

        it('should change the innerHtml of dom when update the component', function() {
            var innerHtml1 = '<h1>Hello world</h1>';
            var innerHtml2 = '<p>This is Qui</p>';

            com.update({
                cnt: innerHtml1
            });

            $('#html-test .box').html().should.be.eql(innerHtml1);

            com.update({
                cnt: innerHtml2
            });

            $('#html-test .box').html().should.be.eql(innerHtml2);
        });

    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
