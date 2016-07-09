__ENV__ = 'S';

var should = require('should');
var sinon = require('sinon');
var ev = require('../../src/core/event');
require('should-sinon');

describe('core/event', function() {
    var el = {};

    ev(el, el);

    afterEach(function() {
        el.off('*');
    });

    describe('@on', function() {
        it('should subscribe a single listener', function() {
            var callback = sinon.spy();

            el.on('a', callback);
            el.trigger('a');

            callback.should.be.calledOnce();
        });

        it('should subscribe a listener by using multiple on with different type', function() {
            var callback = sinon.spy();

            el.on('a', callback).on('b', callback);

            el.trigger('a');
            callback.should.be.calledOnce();

            el.trigger('b');
            callback.should.be.calledTwice();
        });

        it('should subscribe multiple listeners', function() {
            var callback = sinon.spy();

            el.on('a b', callback);

            el.trigger('a');
            callback.should.be.calledOnce();

            el.trigger('b');
            callback.should.be.calledTwice();
        });

        it('should work with special chars', function() {
            var callback = sinon.spy();

            el.on('b/4 c-d d:x', callback);

            el.trigger('b/4');
            callback.should.be.calledOnce();

            el.trigger('c-d');
            callback.should.be.calledTwice();

            el.trigger('d:x');
            callback.should.be.calledThrice();
        });

        it('should subscribe a listener twice by using on twice with same type', function() {
            var callback = sinon.spy();

            el.on('a', callback).on('a', callback).trigger('a');

            callback.should.be.calledTwice();
        });

        it('should not subscribe a listener when the type is "*"', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.on('*', callback).trigger('*');
            el.on('*.a', callback).trigger('*');

            callback.should.not.be.called();
            callback1.should.not.be.called();
        });

        it('should not be affected by namespace when subscribing listeners', function() {
            var callback = sinon.spy();

            el.on('a.b', callback).trigger('a.b').trigger('a');

            callback.should.be.calledTwice();
        });
    });

    describe('@one', function() {
        it('should subscribe a one time listener', function() {
            var callback = sinon.spy();

            el.one('a', callback);
            el.trigger('a');
            el.trigger('a');

            callback.should.be.calledOnce();
        });

        it('should subscribe one time listener to multiple type by using multiple one', function() {
            var callback = sinon.spy();

            el.one('a', callback).one('b', callback).trigger('a').trigger('a').trigger('b').trigger('b');

            callback.should.be.calledTwice();
        });

        it('should subscribe one time listener to multiple type by using one once', function() {
            var callback = sinon.spy();

            el.one('a b', callback).trigger('a').trigger('a').trigger('b').trigger('b');

            callback.should.be.calledTwice();
        });

        it('should subscribe a listener twice by using one twice with same type', function() {
            var callback = sinon.spy();

            el.one('a', callback).one('a', callback).trigger('a').trigger('a').trigger('a');

            callback.should.be.calledTwice();
        });

        it('should work when subscribing same function with one and on the same type', function() {
            var callback = sinon.spy();

            el.one('a', callback).on('a', callback).trigger('a').trigger('a');

            callback.should.be.calledThrice();
        });

        it('should not subscribe a listener when the type is "*"', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.one('*', callback).trigger('*');
            el.one('*.a', callback).trigger('*');

            callback.should.not.be.called();
            callback1.should.not.be.called();
        });

        it('The one event is called once also in a recursive function', function() {
            var counter = 0;

            el.one('a', function() {
                counter++;
                el.one('a', function() {
                    counter++;
                });
            });
            el.trigger('a');
            counter.should.be.eql(1);
            el.trigger('a');
            counter.should.be.eql(2);
        });
    });

    describe('@off', function() {
        it('should remove listener of the type', function() {
            var callback = sinon.spy();

            el.on('a', callback).trigger('a').off('a', callback).trigger('a');

            callback.should.be.calledOnce();
        });

        it('should not throw error when off a non-exist listener', function() {
            (function() {
                el.off('a', function() {});
            }).should.not.be.throw();
        });

        it('should remove the listener by ===', function() {
            var counter1 = 0;
            var callback1 = function() {
                counter1++;
            };
            var callback2 = function() {
                counter1++;
            };

            el.on('a', callback1).trigger('a').off('a', callback2).trigger('a');

            counter1.should.be.eql(2);
        });

        it('should remove duplicate listeners', function() {
            var callback = sinon.spy();

            el.on('a', callback).on('a', callback).trigger('a').off('a', callback).trigger('a');

            callback.should.be.calledTwice();
        });

        it('should remove listener of multiple type', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.on('a b', callback).trigger('a').trigger('b').off('a b', callback).trigger('a').trigger('b');
            callback.should.be.calledTwice();

            el.on('a', callback1).trigger('a').off('a b', callback1).trigger('a');
            callback1.should.be.calledOnce();
        });

        it('should remove all listeners when type is "*" and not giving cb', function() {
            var callback = sinon.spy();

            el.on('a b c', callback).trigger('a').trigger('b').trigger('c')
                .off('*').trigger('a').trigger('b').trigger('c');

            callback.should.be.calledThrice();
        });

        it('should remove all listeners of the type when not giving cb', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.on('a', callback).on('a.b', callback1).trigger('a').off('a').trigger('a');

            callback.should.be.calledOnce();
            callback1.should.be.calledOnce();
        });

        it('should remove all listeners of the namespace when type is "*"', function() {
            var callback = sinon.spy();

            el.on('a.b', callback).on('c.b', callback)
                .trigger('a').trigger('c')
                .off('*.b', callback)
                .trigger('a').trigger('c');

            callback.should.be.calledTwice();
        });

        it('should remove all listeners of the namespace when type is "*" and not giving cb', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.on('a.b', callback).on('c.b', callback1)
                .trigger('a').trigger('c')
                .off('*.b')
                .trigger('a').trigger('c');

            callback.should.be.calledOnce();
            callback1.should.be.calledOnce();
        });

        it('should not remove the listeners without namespace when off the namespace listeners', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();
            var callback2 = sinon.spy();

            el.on('a.b', callback).on('c.b', callback1).on('a', callback2)
                .trigger('a').trigger('c')
                .off('*.b')
                .trigger('a').trigger('c');

            callback.should.be.calledOnce();
            callback1.should.be.calledOnce();
            callback2.should.be.calledTwice();
        });

    });

    describe('@trigger', function() {
        it('should trigger a event', function() {
            var callback = sinon.spy();

            el.on('a', callback).trigger('a');

            callback.should.be.calledOnce();
        });

        it('should trigger multiple event', function() {
            var callback = sinon.spy();

            el.on('a', callback).on('b', callback).trigger('a b');

            callback.should.be.calledTwice();
        });

        it('should ignore the namespace when triggering', function() {
            var callback = sinon.spy();
            var callback1 = sinon.spy();

            el.on('a', callback).on('a.c', callback1).trigger('a.c');

            callback.should.be.calledOnce();
            callback1.should.be.calledOnce();
        });

        it('should be able to trigger events inside a listener', function() {
            var e2 = false;

            el.on('e1', function() {
                this.trigger('e2');
            });
            el.on('e2', function() {
                e2 = true;
            });

            el.trigger('e1');

            e2.should.be.eql(true);
        });

        it('should push the type of event to the listener', function() {
            var t;

            el.on('a b', function(e) {
                e.should.be.Object();
                e.should.be.ownProperty('type');
                if (t === 'a') {
                    e.type.should.be.eql('a');
                } else if (t === 'b') {
                    e.type.should.be.eql('b');
                }
            });

            t = 'a';
            el.trigger('a');

            t = 'b';
            el.trigger('b');
        });

        it('should push the values to the listener when triggering', function() {
            var a = 1;
            var b = {
                c: 2
            };
            var c = [3];

            el.on('a', function(e, p1, p2, p3) {
                p1.should.be.equal(a);
                p2.should.be.equal(b);
                p3.should.be.equal(c);
            });

            el.trigger('a', a, b, c);
        });

        it('should trigger the listeners even these listeners have off in the first listener', function() {
            var callback = sinon.spy();

            el.on('a', function() {
                el.off('a');
            }).on('a', callback).trigger('a').trigger('a');

            callback.should.be.calledOnce();
        });
    });
});
