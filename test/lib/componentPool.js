__ENV__ = 'S';

var should = require('should');
var sinon = require('sinon');
var Pool = require('../../src/lib/componentPool');
require('should-sinon');

describe('lib/componentPool', function() {
    var p;
    var o;

    it('should not new the object when init the pool', function() {
        var clazz = sinon.spy();

        p = new Pool(clazz);

        clazz.should.not.be.calledWithNew();
    });


    it('should new an object when the pool is empty', function() {
        var clazz = sinon.spy();

        p = new Pool(clazz);
        o = p.get();

        clazz.should.be.calledWithNew();
    });

    // it('should call the destroy method of object when releasing', function() {
    //     var clazz = function() {
    //         this.destroy = sinon.spy();
    //     };

    //     p = new Pool(clazz);
    //     o = p.get();
    //     p.release(o);

    //     o.destroy.should.be.calledOnce();
    // });

    it('should return an object when the pool is not empty', function() {
        var count = 0;
        var clazz = function() {
            count++;
            this.destroy = sinon.spy();
        };

        p = new Pool(clazz);
        o = p.get();
        count.should.be.eql(1);

        p.release(o);
        o = p.get();
        count.should.be.eql(1);
    });

});
