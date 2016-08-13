module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <img class="image" src="about:blank" q-attr="{src: url}">\
            <span class="info" q-attr="{\'data-id\': id}">id</span>\
            <span class="style-test" q-attr="{style: styles}">styles</span>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'attr-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@attr', function() {
        beforeEach(function() {
            com.update({
                url: '',
                styles: '',
                id: ''
            });
        });

        it('should able to set src', function() {
            var src = 'http://9.url.cn/edu/img/index/bg-logo-new.385c8.png';

            com.update({
                url: src
            });

            $('#attr-test .image')[0].src.should.equal(src);
        });

        it('should able to set attribute', function() {
            com.update({
                id: 2
            });

            $('#attr-test .info')[0].getAttribute('data-id').should.equal('2');
        });

        it('should able to set style', function() {
            com.update({
                styles: {
                    fontWeight: 'bold'
                }
            });

            $('#attr-test .style-test')[0].style.fontWeight.should.equal('bold');
        });

    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
