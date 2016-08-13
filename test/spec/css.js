module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <span class="css-test" q-css="styles">styles</span>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'css-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@css', function() {
        beforeEach(function() {
            com.update({
                styles: ''
            });
        });

        it('should able to set style without toggling', function() {
            var $dom = $('#css-test .css-test');

            com.update({
                styles: {
                    fontWeight: 'bold'
                }
            });

            $dom[0].style.fontWeight.should.equal('bold');

            com.update({
                styles: {
                    lineHeight: '30px'
                }
            });
            $dom[0].style.fontWeight.should.equal('bold');
            $dom[0].style.lineHeight.should.equal('30px');
        });

    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
