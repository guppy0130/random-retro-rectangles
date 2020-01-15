const {
    canMove,
    gridGenerator,
    grow
} = require('../index');

const assert = require('assert');

describe('gridGenerator', function() {
    it('makes a 3x3 grid filled with zeroes', function() {
        let trueResult = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        assert.deepEqual(gridGenerator([], 3, 3), trueResult);
    });
});

describe('canMove', function() {
    let grid;
    describe('No modifications', function() {
        beforeEach(() => {
            grid = gridGenerator([], 3, 3);
            // console.table(grid);
        });
        describe('North', function() {
            it('fails from 1,0', function() {
                assert.equal(canMove.north(grid, 1, 0), false);
            });
            it('passes from 0,1', function() {
                assert.equal(canMove.north(grid, 0, 1), true);
            });
        });
        describe('East', function() {
            it('fails from 2,0', function() {
                assert.equal(canMove.east(grid, 2, 0), false);
            });
            it('passes from 0,0', function() {
                assert.equal(canMove.east(grid, 0, 0), true);
            });
        });
        describe('South', function() {
            it('fails from 0,2', function() {
                assert.equal(canMove.south(grid, 0, 2), false);
            });
            it('passes from 0,0', function() {
                assert.equal(canMove.south(grid, 0, 0), true);
            });
        });
        describe('West', function() {
            it('fails from 0,0', function() {
                assert.equal(canMove.west(grid, 0, 0), false);
            });
            it('passes from 1,0', function() {
                assert.equal(canMove.west(grid, 1, 0), true);
            });
        });
    });

    describe('Modifications', function() {
        beforeEach(() => {
            grid = gridGenerator([], 5, 5);
            grid[2][2] = 1;
            // console.table(grid);
        });
        describe('North', function() {
            it('fails from 2,3', function() {
                assert.equal(canMove.north(grid, 2, 3), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canMove.north(grid, x, y), true);
                });
            }
        });
        describe('East', function() {
            it('fails from 1,2', function() {
                assert.equal(canMove.east(grid, 1, 2), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canMove.east(grid, x, y), true);
                });
            }
        });
        describe('South', function() {
            it('fails from 2,1', function() {
                assert.equal(canMove.south(grid, 2, 1), false);
            });
            for (const [x, y] of [[1, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canMove.south(grid, x, y), true);
                });
            }
        });
        describe('West', function() {
            it('fails from 3,2', function() {
                assert.equal(canMove.west(grid, 3, 2), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canMove.west(grid, x, y), true);
                });
            }
        });
    });
});

describe('grow', function() {
    let grid;
    beforeEach(function() {
        grid = gridGenerator([], 3, 3);
    });
    it('grows when p = 1', function () {
        grid[1][1] = 1;
        grow(grid, 1, 1, 1, 1);
        let trueResult = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
        assert.deepEqual(grid, trueResult);
    });
    it('does not grow when p = 0', function() {
        grid[1][1] = 1;
        grow(grid, 1, 1, 1, 0);
        let trueResult = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ];
        assert.deepEqual(grid, trueResult);
    });
});
