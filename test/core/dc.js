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
    dc(obj, obj);
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
        dc(o, o);

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

    it('should compare the values by "==="" not "=="', function() {
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

    describe('for object type', function() {
        beforeEach(function() {
            delete obj.a;
            delete obj.ret;
            obj.dc();
            obj.time = 0;
        });

        it('should work with undefined', function() {
            obj.a = {
                v: 1
            };
            obj.dc();
            obj.time.should.be.eql(1);
        });

        it('should look inside', function() {
            obj.a = {
                v: 1
            };
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a.v = 2;
            obj.dc();
            obj.time.should.be.eql(2);
        });

        it('should look inside for just one layer', function() {
            obj.a = {
                b: {
                    c: 1
                }
            };
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a.b.c = 2;
            obj.dc();
            obj.time.should.be.eql(1);
        });

        it('should not check the outer object', function() {
            obj.a = {
                v: 1
            };
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a = {
                v: 1
            };
            obj.dc();
            obj.time.should.be.eql(1);
        });

        it('should check the value with "==="', function() {
            obj.a = {
                b: {
                    c: 1
                }
            };
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a.b = {
                c: 1
            };
            obj.dc();
            obj.time.should.be.eql(2);
        });
    });

    describe('for array type', function() {
        beforeEach(function() {
            delete obj.a;
            delete obj.ret;
            obj.dc();
            obj.time = 0;
        });

        it('should work with undefined', function() {
            obj.a = [1, 2];
            obj.dc();
            obj.time.should.be.eql(1);
        });

        it('should look inside', function() {
            obj.a = [1, 2];
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a[0] = 3;
            obj.dc();
            obj.time.should.be.eql(2);
        });

        it('should find the different with object items', function() {
            obj.a = [{
                b: {
                    c: 1
                }
            }, 2];
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a[0] = {
                b: {
                    c: 1
                }
            };
            obj.dc();
            obj.time.should.be.eql(2);

            obj.a[0].b.c = 2;
            obj.dc();
            obj.time.should.be.eql(2);
        });

        it('should find the different with array items', function() {
            obj.a = [[[1, 3], 2], 2];
            obj.dc();
            obj.time.should.be.eql(1);

            obj.a[0][0][0] = 2;
            obj.dc();
            obj.time.should.be.eql(2);
        });
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

        obj.watch('a', trigger);
    });
});
