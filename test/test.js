describe('just test for karma', function() {
    var a = 1;
    var div;

    before(function() {
        div = document.createElement('div');
        div.innerHTML =
            '<h1 class="title">111</h1>\
            <p class="desc">222</p>';
        document.body.appendChild(div);
    });

    it('should be right', function() {
        a.should.be.eql(1);
    });

    it('should be right too', function() {
        $('.title').text().should.be.eql('111');
        $('.desc').text().should.be.eql('222');
    });

    after(function() {
        document.body.removeChild(div);
    });
});
