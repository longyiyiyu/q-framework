__ENV__ = 'S';

var should = require('should');
var sinon = require('sinon');
var m = require('../../src/core/mixin');
require('should-sinon');

describe('core/mixin', function() {
    var el;

    beforeEach(function() {
        el = {};
        m(el, el);
    });

    it('should mixin a function', function() {
        var callback = sinon.spy();

        el.mixin(callback);
        callback.should.be.calledOnce();
    });

    it('should mixin an object', function() {
        var callback = sinon.spy();

        el.mixin({
            a: 1,
            b: 'a',
            c: [1, 2],
            d: callback
        });

        el.a.should.be.eql(1);
        el.b.should.be.eql('a');
        el.c.should.be.eql([1, 2]);

        el.d();
        callback.should.be.calledOnce();
    });

    it('should cache a mixin & get a mixin from a key', function() {
        var callback = sinon.spy();

        el.mixin('a', callback);

        el.mixin('a');
        callback.should.be.calledOnce();
    });

    it('should mixin an array of mixins', function() {
        var callback = sinon.spy();
        var callback1 = sinon.spy();

        el.mixin('a', callback);

        el.mixin(['a', callback1, {
            a: 1
        }]);

        callback.should.be.calledOnce();
        callback1.should.be.calledOnce();
        el.a.should.be.eql(1);
    });

    it('should use the value of the later mixin', function() {
        el.mixin([{
            a: 1,
            b: 2
        }, {
            a: 3
        }]);

        el.a.should.be.eql(3);
        el.b.should.be.eql(2);
    });

    it('should not throw error when use non-object or non-function mixins', function() {
        (function() {
            el.mixin('a', 1, 'bbb');
            el.mixin(1);
            el.mixin(/aaa/);
        }).should.not.be.throw();
    });

    it('should cache a mixin with an el then other el can use it', function() {
        var callback = sinon.spy();
        var el2 = {};

        m(el2, el2);

        el.mixin('a', callback);

        el2.mixin('a');
        callback.should.be.calledOnce();
    });

    it('should give the element itself to the function mixin', function() {
        el.mixin(function(e) {
            e.should.be.equal(el);
        });
    });

    it('should call the init function of object mixin', function() {
        el.mixin({
            init: function(e) {
                e.should.be.equal(el);
            }
        });

        should(el.init).be.undefined();
    });

});
