module.exports = function(Q) {
    var cnt;
    var ComClass;
    var com;
    var innerHtml;
    var componentHtml =
        '<com>\
            <div class="show1" q-show="isShow" style="display: none"></div>\
            <style>.show2 { display: none; }</style>\
            <div class="show2" q-show="isShow"></div>\
        </com>';

    before(function() {
        cnt = document.createElement('div');
        cnt.id = 'show-test';
        document.body.appendChild(cnt);

        ComClass = Q.component(componentHtml);
        com = new ComClass(innerHtml);
        cnt.appendChild(com.getDom());
    });

    describe('@show', function() {
        beforeEach(function() {
            com.update({
                isShow: ''
            });
        });

        it('should show a element', function () {
            com.update({
                isShow: true
            });

            $('#show-test .show1')[0].style.display.should.equal('');
        });

        it('should show a block when its display is none', function () {
            com.update({
                isShow: true
            });

            $('#show-test .show2')[0].style.display.should.equal('block');
        });
    });

    after(function() {
        document.body.removeChild(cnt);
    });

};
