__ENV__ = 'S';

var should = require('should');
var util = require('../../src/lib/util');

describe('lib/util', function() {

    describe('replaceYields', function() {
        it('should return "" when then input is empty string', function() {
            util.replaceYields('').should.be.eql('');
        });

        it('should return the same input when the input is not a string', function() {
            util.replaceYields(11).should.be.eql(11);
            util.replaceYields({
                aa: 1
            }).should.be.eql({
                aa: 1
            });
            util.replaceYields([1, 2]).should.be.eql([1, 2]);
        });

        it('should return the same input when there is not any replacement', function() {
            util.replaceYields('<h1></h1>').should.be.eql('<h1></h1>');
        });

        it('should replace the yield blocks by their names', function() {
            util.replaceYields('<div><yield from="title"></yield></div>', '<yield to="title"><h1>Hello world</h1></yield>')
                .should.be.eql('<div><h1>Hello world</h1></div>');

            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield></div>', '<yield to="title"><h1>Hello world</h1></yield><yield to="desc"><p>I\'m longyiyiyu.</p></yield>')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p><p>I\'m longyiyiyu.</p></div>');
        });

        it('should be ok when some named yield blocks has not be replaced and they will not be outputted', function() {
            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield></div>', '<yield to="title"><h1>Hello world</h1></yield>')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p></div>');
        });

        it('should be ok when the named yield blocks inputted are not required', function() {
            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield></div>', '<yield to="title"><h1>Hello world</h1></yield><yield to="notexist"><p>Are you kidding me?</p></yield>')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p></div>');
        });

        it('should replace the anonymous yield block with the inner html which is not include the named yield blocks', function() {
            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield><yield></yield></div>', 'innerBefore<yield to="title"><h1>Hello world</h1></yield><br/>innerAfter')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p></div>innerBefore<br/>innerAfter');
        });

        it('should retain the yield blocks nested', function() {
            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield><yield></yield></div>', '<yield to="title"><h1>Hello world</h1></yield><yield to="desc"><desc><yield to="other">I\'m a programmer!</yield></desc></yield>')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p></div><desc><yield to="other">I\'m a programmer!</yield></desc>');
        });

        it('should not replace the yield blocks nested', function() {
            util.replaceYields('<div><yield from="title"></yield><p>Hi</p><yield from="desc"></yield><p>Hi2</p><yield from="test"></yield></div>', '<yield to="title"><h1>Hello world</h1></yield><yield to="desc"><desc><yield to="other">I\'m a programmer!</yield><yield to="test">just for test!</yield></desc></yield>')
                .should.be.eql('<div><h1>Hello world</h1><p>Hi</p></div><desc><yield to="other">I\'m a programmer!</yield><yield to="test">just for test!</yield></desc><p>Hi2</p>');
        });
    });
});
