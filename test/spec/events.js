module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <h1 class="title" q-text="title"></h1>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'events-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@events', function() {
        beforeEach(function() {
            com.update({
                title: ''
            });
        });

        it('should trigger init event when the component has inited', function() {
            com = new ComClass(innerHtml);
            cnt.appendChild(com.getDom());
        });

        describe('[init]', function() {
            it('should ', function() {
                com.update({
                    desc: 'Jack'
                });

                $('#test .desc').text().should.be.eql(': Jack');
            });
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
