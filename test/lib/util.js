__ENV__ = 'S';

var should = require('should');
var util = require('../../src/lib/util');

describe('lib/util', function() {
    var patchesObj;
    var key = 'id';
    var keyFun = function(item) {
        return item.id;
    };

    describe('@listDiff', function() {
        it('should return empty patches when the inputs are empty array', function() {
            patchesObj = util.listDiff([], []);

            patchesObj.patches.should.have.length(0);
        });

        it('should remove all items when they are has not key', function() {
            var o = [1, 2, 3];
            patchesObj = util.listDiff(o, []);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                type: 0
            }, {
                index: 0,
                type: 0
            }, {
                index: 0,
                type: 0
            }]);
        });

        it('should insert all items when they are has not key', function() {
            var n = [1, 2, 3];
            patchesObj = util.listDiff([], n);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: 1,
                type: 1
            }, {
                index: 1,
                item: 2,
                type: 1
            }, {
                index: 2,
                item: 3,
                type: 1
            }]);
        });

        it('should use the string to find the key', function() {
            patchesObj = util.listDiff([{
                id: 1,
                v: 1
            }], [{
                id: 1,
                v: 2
            }], key);

            patchesObj.patches.should.have.length(0);
        });

        it('should use the function to find the key', function() {
            patchesObj = util.listDiff([{
                id: 1,
                v: 1
            }], [{
                id: 1,
                v: 2
            }], keyFun);

            patchesObj.patches.should.have.length(0);
        });

        it('should not need patches when the items with not key change their position but their relative position with the key item has not changed', function() {
            var o = [{
                id: 1
            }, 1, 2, 3];
            var n = [{
                id: 1
            }, 3, 1, 2];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.have.length(0);
        });

        it('should insert the items with not key when their relative position with the key item have changed', function() {
            var o = [{
                id: 1
            }, 1, 2, 3];
            var n = [2, 3, {
                id: 1
            }, 1];
            patchesObj = util.listDiff(o, n, key);

            console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: 2,
                type: 1
            }, {
                index: 1,
                item: 3,
                type: 1
            }]);
        });

        it('should return empty patches when the inputs are empty array', function() {
            patchesObj = util.listDiff([], []);

            patchesObj.patches.should.have.length(0);
        });

    });

});
