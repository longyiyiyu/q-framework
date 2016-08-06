module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <h1 class="title" q-text="title"></h1>\
            <p class="desc" q-text="title + \': \' + desc"></p>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@text', function() {
        beforeEach(function() {
            com.update({
                title: '',
                desc: ''
            });
        });

        it('should change the text of dom when update the component', function() {
            com.update({
                desc: 'Jack'
            });

            $('#test .desc').text().should.be.eql(': Jack');
        });

        it('should change the text right when the data are used more than one place', function() {
            com.update({
                title: 'Hello',
                desc: 'Anne'
            });

            $('#test .title').text().should.be.eql('Hello');
            $('#test .desc').text().should.be.eql('Hello: Anne');
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
