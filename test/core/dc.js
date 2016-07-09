__ENV__ = 'S';

var should = require('should');
var dc = require('../../src/core/dc');

describe('core/dc', function() {
    var obj = {};
    var trigger;

    trigger = function(v) {
        this.time++;
        this.ret = v;
    };
    dc(obj);
    obj.watch('a', trigger);

    it('should trigger the callback when the value has changed', function() {
        delete obj.a;
        delete obj.ret;
        obj.time = 0;

        should(obj.ret).be.eql(undefined);
        should(obj.a).be.eql(undefined);

        obj.a = 1;
        obj.dc();

        obj.ret.should.be.eql(1);
        obj.time.should.be.eql(1);

        obj.a = true;
        obj.dc();

        obj.ret.should.be.eql(true);
        obj.time.should.be.eql(2);
    });

    it('should work when there is not any watcher', function() {
        var o = {};
        dc(o);

        (function() {
            o.dc();
        }).should.not.throw();
    });

    it('shoul not trigger when the value is not change', function() {
        delete obj.a;
        delete obj.ret;
        obj.time = 0;

        should(obj.ret).be.eql(undefined);
        should(obj.a).be.eql(undefined);

        obj.a = 1;
        obj.dc();

        obj.ret.should.be.eql(1);
        obj.time.should.be.eql(1);

        obj.dc();
        obj.ret.should.be.eql(1);
        obj.time.should.be.eql(1);
    });

    it('the value compared by "==="" not "=="', function() {
        delete obj.a;
        delete obj.ret;

        should(obj.ret).be.eql(undefined);
        should(obj.a).be.eql(undefined);

        obj.a = 2;
        obj.dc();

        obj.ret.should.be.eql(2);

        obj.a = '2';
        obj.dc();

        obj.ret.should.be.eql('2');
    });

    it('check the object value just by "===" while it will not look inside', function() {
        delete obj.a;
        delete obj.ret;
        obj.time = 0;

        should(obj.ret).be.eql(undefined);
        should(obj.a).be.eql(undefined);

        obj.a = {
            v: 1
        };
        obj.dc();

        obj.time.should.be.eql(1);

        // deep equal check is time-consuming, so it just check the object value by "==="
        // by using this framework with redux, it will work well
        obj.a.v = 2;
        obj.dc();
        obj.time.should.be.eql(1);
    });

    it('shoulk remove the watcher correctly', function() {
        delete obj.a;
        delete obj.ret;
        obj.time = 0;

        should(obj.ret).be.eql(undefined);
        should(obj.a).be.eql(undefined);

        obj.a = 1;
        obj.dc();

        obj.ret.should.be.eql(1);
        obj.time.should.be.eql(1);

        obj.unwatch('a', trigger);

        obj.a = 2;
        obj.dc();

        obj.ret.should.be.eql(1);
        obj.time.should.be.eql(1);
    });
});
