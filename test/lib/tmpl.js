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
    obj2: {
        v: {
            k: 1
        }
    },
    arr: [2],
    x: 2,
    $a: 0,
    $b: 1,
    esc: '\'\n\\',
    fn: function(s) {
        return ['hi', s].join(' ');
    },
    fn1: function(o) {
        return o.x + o.y;
    },
    fn2: function(arr) {
        var sum = 0;
        for (var i = 0, l = arr.length; i < l; ++i) {
            sum += arr[i];
        }
        return sum;
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
        should(render('arr.push(2)')).be.eql(1);
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
        should(render('str + " y" + \' z\'')).be.eql('x y z');
        should(render('esc')).be.eql(data.esc);
        should(render('$a')).be.eql(0);
        should(render('$a + $b')).be.eql(1);
        should(render('this.str')).be.eql('x');
    });

    it('global variables are supported in expressions', function() {
        should(render('globalVar')).be.eql(globalVar);
    });

    it('all comments in expressions are stripped from the output (not anymore)', function() {
        should(render('/* comment */ /* as*/')).be.eql(undefined);
        should(render('1 /* comment */ + 1')).be.eql(2);
    });

    it('both templates and expressions are new-line-friendly', function() {
        should(render('\n yes \n ? 2 \n : 4 \n')).be.eql(2);
    });

    it('can process object and array expressions', function() {
        should(render('{ a: {y: x} }')).be.eql({
            a: {
                y: 2
            }
        });
        should(render('JSON.stringify({ a: {y: x} })')).be.eql('{"a":{"y":2}}');
        should(render('fn1({x: 1, y: $b})')).be.eql(2);
        should(render('[x, $b]')).be.eql([2, 1]);
        should(render('[{x: x, y: $a}, $b]')).be.eql([{
            x: 2,
            y: 0
        }, 1]);
        should(render('fn2([x, $b, 3])')).be.eql(6);
        should(render('fn2([x, obj.val, 3, str === "x" ? x : 0, no || $b, $b && x, globalVar])')).be.eql(17);
        should(render('fn2([x, fn1({x:x,y:3})/5, 3, !!(4 > 2), arr[0], yes ? x : 0])')).be.eql(11);
    });

    it('few errors in recognizing complex expressions', function() {
        data.$a = 0;
        data.$b = 0;
        data.parent = {
            selectedId: 0
        };
        // FIX #784 - The shorthand syntax for class names doesn't support parentheses
        should(render('{ primary: (parent.selectedId === $a)  }')).be.eql({
            primary: true
        });
        // a bit more of complexity. note: using the comma operator requires parentheses
        should(render('{ ok: ($b++, ($a > 0) || ($b & 1)) }')).be.eql({
            ok: 1
        });
    });

    it('unwrapped keywords void, window and global, in addition to `this`', function() {
        data.$a = 5;
        should(render((typeof window === 'object' ? 'window' : 'global') + '.globalVar')).be.eql(5);
        should(render('this.$a')).be.eql(5);
        should(render('void 0')).be.eql(undefined);
        // without unprefixed global/window, default convertion to `new (D).Date()` throws here
        data.Date = typeof window !== 'object' ? 'global' : 'window';
        should(render('new ' + data.Date + '.Date()')).be.Object();
        delete data.Date;
    });

    it('better recognition of literal regexps', function() {
        should(render('/{}\\/\\n/.source ')).be.eql('{}\\/\\n');
        should(render('/{}\\/\\n/.test("{}\\/\\n")')).be.true();
        // handling quotes in regexp is not so complicated :)
        should(render('/"\'/.source ')).be.eql('"\'');
        should(render('/"\'/.test("\\"\'") ')).be.true(); // ok: /"'/.test("\"'")
        // html template don't have escape
        should(render('(rex = /"\'/)')).be.eql(/"'/);
        // no confusion with operators
        data.x = 2;
        should(render('10 /x+10/ 1 ')).be.eql(15);
        should(render(' x /2+x/ 1 ')).be.eql(3);
        should(render(' x /2+"abc".search(/c/) ')).be.eql(3);
        // in expressions, there's no ASI
        should(render(' x\n /2+x/ 1 ')).be.eql(3);
    });

    it('you can include almost anything in quoted shorhand names', function() {
        should(render('{ "_\u221A": x }')).be.eql({
            '_\u221A': 2
        });
        should(render('((this["\u221A"] = 1, this["\u221A"]) )')).be.eql(1);
    });

    it('correct handling of quotes', function() {
        should(render("filterState==''?'empty':'notempty'")).be.eql('notempty');
        should(render(' "House \\"Atrides\\" wins" ')).be.eql('House "Atrides" wins');
        should(render(' "Leto\'s house" ')).be.eql("Leto's house");
        should(render(" \"Leto\\\\\\\'s house\" ")).be.eql('Leto\\\'s house'); //« In '{ "Leto\\\'s house" }' » --> In 'Leto\'s house'
        should(render(' "Leto\'s house" ')).be.eql("Leto\'s house"); //« In "{ "Leto's house" }"    » --> In "Leto's house"
        should(render(' \'Leto\\\'s house\' ')).be.eql("Leto\'s house"); //« In "{ 'Leto\'s house' }"   » --> In "Leto's house"
    });

    describe('whitespace', function() {
        it('is compacted to a space in expressions', function() {
            // you need see at generated code
            should(render('  yes ?\n\t2 : 4 ')).be.eql(2);
            should(render(' \t \nyes !== no\r\n ')).be.eql(true);
        });

        it('is preserved in literal javascript strings', function() {
            should(render(' "\r\n \n \r" ')).be.eql('\r\n \n \r');
            should(render('{ ok: "\r\n".charCodeAt(0) === 13 }')).be.eql({
                ok: true
            });
        });

        it('eols (mac/win) are normalized to unix in html text', function() {
            should(render('\r\n  \r"\n"  \r\n')).be.eql('\n');
        });
    });

    it('support for 8 bit, ISO-8859-1 charset in shorthand names', function() {
        should(render('"neón"')).be.eql('neón');
        should(render('"-ä"')).be.eql('-ä'); // '-ä' is a valid class name
        should(render('"ä"')).be.eql('ä');
    });

    it('does not wrap global and window object names', function() {
        var gw = typeof window === 'object' ? 'window' : 'global';

        should(render(gw + '.globalVar ')).be.eql(5);
        data.Date = '{}';
        should(render(' +new ' + gw + '.Date() ')).be.Number();
        delete data.Date;
    });

    it('unwrapped keywords: Infinity, isFinite, isNaN, Date, RegExp and Math', function() {
        var i, a = ['isFinite', 'isNaN', 'Date', 'RegExp', 'Math'];

        for (i = 0; i < a.length; ++i) {
            data[a[i]] = 0;
        }
        should(render(' Infinity ')).be.Number();
        should(render(' isFinite(1) ')).be.eql(true);
        should(render(' isNaN({}) ')).be.eql(true);
        should(render('Date.parse ')).be.Function();
        should(render(' RegExp.$1 ')).be.String();
        should(render(' Math.floor(0) ')).be.Number();

        for (i = 0; i < a.length; ++i) {
            delete data[a[i]];
        }
    });

    describe('support for comments has been dropped', function() {
        // comments within expresions are converted to spaces, in concordance with js specs
        it('if included, the expression may work, but...', function() {
            should(render(' typeof/**/str === "string" ')).be.eql(true);
            should(render('1+/* */+2 ')).be.eql(3);

            // riot parse correctamente empty and exotic comments
            should(render(' /**/ ')).be.eql(undefined); // empty comment
            should(render(' /*/* *\/ /**/ ')).be.eql(undefined); // nested comment sequences
            should(render(' /*dummy*/ ')).be.eql(undefined);

            // nor in the template text, comments inside strings are preserved
            should(render(' "/* ok */" ')).be.eql('/* ok */');
            should(render(' "/*/* *\/ /**/" ')).be.eql('/*/* *\/ /**/');
            should(render(' "/* \\"comment\\" */" ')).be.eql('/* "comment" */');
        });

        it('something like `{ ok:1 /*,no:1*/ } give correct result too', function() {
            should(render('{ ok: 1 /*, no: 1*/ }')).be.eql({
                ok: 1
            });
            should(render(' { /* comment */ }')).be.eql({});
        });

        it('others can break your application, e.g. { ok/**/: 1 }', function() {
            (function() {
                render('{ ok/**/: 1 }');
            }).should.throw();
        });
    });
});
