__ENV__ = 'S';

var should = require('should');
var util = require('../../src/lib/util');

describe('lib/util', function() {
    var patchesObj;
    var key = 'id';
    var keyFun = function(item) {
        return item.id;
    };

    /*
     * 这个算法是根据经验来的，因此不需要全面测试
     * 这里只需要覆盖所有最可能出现的情况即可
     * 非经验情况是不推荐使用的，出现问题自负
     * 该方法仅用于 repeat
     * repeat 逻辑：
     * 1. 入参：一个数组
     * 2. 需要优化的点是：相同的 item 可能数据没变，只是位置变了，比如列表中间的增删
     * 3. 一开始先排位置，排位置必须要对 item 进行 id 识别 （listDiff 就是解决这个问题的）
     * 4. 然后再用入参数组去 update 即可
     * 5. 下面每个 test case 就是一个经验场景
     * 
     */
    describe('@listDiff', function() {
        // 1. [] => []
        it('should return empty patches when the inputs are empty array', function() {
            patchesObj = util.listDiff([], []);

            patchesObj.patches.should.have.length(0);
        });

        // 2. [] => [新数据或者被丢失id的数据]
        it('should insert all items when they are has not key', function() {
            var n = [1, 2, 3];
            patchesObj = util.listDiff([], n);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: undefined,
                type: 1
            }, {
                index: 1,
                item: undefined,
                type: 1
            }, {
                index: 2,
                item: undefined,
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

        // 3. 新增数据
        it('should work when adding data', function() {
            var o = [{
                id: 1
            }, {
                id: 2
            }];
            var n = [{
                id: 1
            }, {
                id: 2
            }, 1, 2];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 2,
                item: undefined,
                type: 1
            }, {
                index: 3,
                item: undefined,
                type: 1
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }];
            n = [1, 2, {
                id: 1
            }, {
                id: 2
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: undefined,
                type: 1
            }, {
                index: 1,
                item: undefined,
                type: 1
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            n = [{
                id: 1
            }, {
                id: 2
            }, 1, 2, {
                id: 3
            }, {
                id: 4
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 2,
                item: undefined,
                type: 1
            }, {
                index: 3,
                item: undefined,
                type: 1
            }]);
        });

        // 4. 删除数据
        it('should work when removing data', function() {
            var o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            var n = [{
                id: 1
            }, {
                id: 2
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj.patches);
            patchesObj.patches.should.be.eql([{
                index: 2,
                type: 0
            }, {
                index: 2,
                type: 0
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            n = [{
                id: 3
            }, {
                id: 4
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                type: 0
            }, {
                index: 0,
                type: 0
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            n = [{
                id: 1
            }, {
                id: 4
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 1,
                type: 0
            }, {
                index: 1,
                type: 0
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            n = [];
            patchesObj = util.listDiff(o, n, key);

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
            }, {
                index: 0,
                type: 0
            }]);
        });


        // 下面的 test case 不是经验场景，用来测试这个算法不会出现问题
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

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: 2,
                type: 1
            }, {
                index: 1,
                item: 3,
                type: 1
            }]);

            o = [2, 3, {
                id: 1
            }, 1];
            n = [{
                id: 1
            }, 1, 2, 3];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: {
                    id: 1
                },
                type: 1
            }, {
                index: 3,
                item: 1,
                type: 1
            }]);
        });

        it('should work when reversing', function() {
            var o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }];
            var n = [{
                id: 4
            }, {
                id: 3
            }, {
                id: 2
            }, {
                id: 1
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj.patches);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: {
                    id: 4
                },
                type: 1
            }, {
                index: 1,
                item: {
                    id: 3
                },
                type: 1
            }, {
                index: 2,
                type: 0
            }, {
                index: 3,
                item: {
                    id: 1
                },
                type: 1
            }]);

            o = [{
                id: 1
            }, {
                id: 2
            }, {
                id: 3
            }, {
                id: 4
            }, {
                id: 5
            }];
            n = [{
                id: 5
            }, {
                id: 4
            }, {
                id: 3
            }, {
                id: 2
            }, {
                id: 1
            }];
            patchesObj = util.listDiff(o, n, key);

            // console.log('>>> patchesObj:', patchesObj.patches);
            patchesObj.patches.should.be.eql([{
                index: 0,
                item: {
                    id: 5
                },
                type: 1
            }, {
                index: 1,
                item: {
                    id: 4
                },
                type: 1
            }, {
                index: 2,
                item: {
                    id: 3
                },
                type: 1
            }, {
                index: 3,
                type: 0
            }, {
                index: 4,
                item: {
                    id: 1
                },
                type: 1
            }]);
        });

    });

});
