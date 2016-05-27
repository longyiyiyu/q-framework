var should = require('should');
var tmpl = require('../../src/lib/tmpl');

globalVar = 5;

var data = {
    yes: true,
    no: false,
    str: 'x',
    obj: {
        val: 2
    },
    arr: [2],
    x: 2,
    $a: 0,
    $b: 1,
    esc: '\'\n\\',
    fn: function(s) {
        return ['hi', s].join(' ');
    },
    _debug_: 0
};

var RAW_FLAG = '=';

function render(str, dbg) {
    if (dbg) data._debug_ = 1;
    return tmpl(str, data);
}

describe('lib/tmpl', function() {
    it('expressions always return a raw value', function() {
        render('1').should.be.eql(1);
        render('x').should.be.eql(2);
        render('str').should.be.eql(data.str);
        render('obj').should.be.eql(data.obj);
        render('arr').should.be.eql(data.arr);
        render('fn').should.be.eql(data.fn);
        render('').should.be.eql('');
        should(render('null')).be.eql(null);
        render('no').should.be.eql(false);
        render('yes').should.be.eql(true);
        render('$a').should.be.eql(0);
    });

    it('empty expressions equal to undefined', function() {
        should(render()).be.eql(undefined);
    });

    it('undefined vars are catched in expressions and returns undefined', function() {
        should(render('nonExistingVar')).be.eql(undefined);
        data.parent = undefined;
        should(render('parent.some.thing')).be.eql(undefined);
        should(render('!nonExistingVar')).be.eql(true);
        should(render('nonExistingVar ? "yes" : "no"')).be.eql('no');
        should(render('!nonExistingVar ? "yes" : "no"')).be.eql('yes');
        delete data.parent;
    });

    it('expressions are just regular JavaScript', function() {
        should(render('obj.val')).be.eql(2);
        should(render('obj["val"]')).be.eql(2);
        should(render('arr[0]')).be.eql(2);
        should(render('arr[0];')).be.eql(2);
        should(render('arr.pop()')).be.eql(2);
        should(render('fn(str)')).be.eql('hi x');
        should(render('yes && "ok"')).be.eql('ok');
        should(render('no && "ok"')).be.eql(false);
        should(render('false || null || !no && yes')).be.eql(true);
        should(render('!no ? "yes" : "no"')).be.eql('yes');
        should(render('!yes ? "yes" : "no"')).be.eql('no');
        should(render('/^14/.test(+new Date())')).be.eql(true);
        should(render('typeof Math.random()')).be.eql('number');
        should(render('fn("there")')).be.eql('hi there');
        should(render('str == "x"')).be.eql(true);
        should(render('/x/.test(str)')).be.eql(true);
        should(render('true ? "a b c" : "foo"')).be.eql('a b c');
        should(render('true ? "a \\"b\\" c" : "foo"')).be.eql('a "b" c');
        should(render('str + " y" + \' z\'}')).be.eql('x y z');
        should(render('esc')).be.eql(data.esc);
        should(render('$a')).be.eql(0);
        should(render('$a + $b')).be.eql(1);
        should(render('this.str')).be.eql('x');
    });
});
