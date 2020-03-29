const {
    canGrow,
    gridGenerator,
    grow,
    buildMagicObj,
    hasZeroes,
    fillGrid,
} = require('../index');

const assert = require('assert');

describe('gridGenerator', function() {
    it('makes a 3x3 grid filled with zeroes', function() {
        let trueResult = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        assert.deepStrictEqual(gridGenerator([], 3, 3), trueResult);
    });
});

describe('canGrow', function() {
    let grid;
    describe('No modifications', function() {
        beforeEach(() => {
            grid = gridGenerator([], 3, 3);
        });

        describe('North', function() {
            it('fails from 1,0', function() {
                assert.equal(canGrow.north(grid, 1, 0), false);
            });

            it('passes from 0,1', function() {
                assert.equal(canGrow.north(grid, 0, 1), true);
            });
        });

        describe('East', function() {
            it('fails from 2,0', function() {
                assert.equal(canGrow.east(grid, 2, 0), false);
            });

            it('passes from 0,0', function() {
                assert.equal(canGrow.east(grid, 0, 0), true);
            });
        });

        describe('South', function() {
            it('fails from 0,2', function() {
                assert.equal(canGrow.south(grid, 0, 2), false);
            });

            it('passes from 0,0', function() {
                assert.equal(canGrow.south(grid, 0, 0), true);
            });
        });

        describe('West', function() {
            it('fails from 0,0', function() {
                assert.equal(canGrow.west(grid, 0, 0), false);
            });

            it('passes from 1,0', function() {
                assert.equal(canGrow.west(grid, 1, 0), true);
            });
        });
    });

    describe('Modifications', function() {
        beforeEach(() => {
            grid = gridGenerator([], 5, 5);
            grid[2][2] = 1;
        });

        describe('North', function() {
            it('fails from 2,3', function() {
                assert.equal(canGrow.north(grid, 2, 3), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canGrow.north(grid, x, y), true);
                });
            }
        });

        describe('East', function() {
            it('fails from 1,2', function() {
                assert.equal(canGrow.east(grid, 1, 2), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canGrow.east(grid, x, y), true);
                });
            }
        });

        describe('South', function() {
            it('fails from 2,1', function() {
                assert.equal(canGrow.south(grid, 2, 1), false);
            });
            for (const [x, y] of [[1, 1], [3, 1], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canGrow.south(grid, x, y), true);
                });
            }
        });

        describe('West', function() {
            it('fails from 3,2', function() {
                assert.equal(canGrow.west(grid, 3, 2), false);
            });
            for (const [x, y] of [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [1, 3], [2, 3], [3, 3]]) {
                it(`passes from ${x},${y}`, function() {
                    assert.equal(canGrow.west(grid, x, y), true);
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
        assert.deepStrictEqual(grid, trueResult);
    });

    it('returns locations it grew to', function () {
        grid[1][1] = 1;
        let growResult = grow(grid, 1, 1, 1, 1);
        assert.deepStrictEqual(growResult, [
            (1, 0),
            (2, 1),
            (1, 2),
            (0, 1)
        ]);
    });

    it('does not grow when p = 0', function() {
        grid[1][1] = 1;
        grow(grid, 1, 1, 1, 0);
        let trueResult = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ];
        assert.deepStrictEqual(grid, trueResult);
    });

    it('does not grow when blocked', function() {
        grid[1][0] = 1;
        grid[2][1] = 1;
        grid[1][2] = 1;
        grid[0][1] = 1;
        grid[1][1] = 2;
        grow(grid, 1, 1, 2, 1);
        let trueResult = [
            [0, 1, 0],
            [1, 2, 1],
            [0, 1, 0]
        ];
        assert.deepStrictEqual(grid, trueResult);
    });
});

describe('hasZeroes', function() {
    it('returns true if there are zeroes', function() {
        let grid = gridGenerator([], 3, 3);
        assert(hasZeroes(grid));
        grid = [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
        ];
        assert(hasZeroes(grid));
    });

    it('returns false if there are no zeroes', function() {
        let grid = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];
        assert(!hasZeroes(grid));
    });
});

describe('fillGrid', function() {
    let grid;
    let width = 3;
    let height = 3;

    beforeEach(() => {
        grid = gridGenerator([], width, height);
    });

    it('fills an empty grid eventually', function() {
        fillGrid(grid, 0.2, width, height);
        assert(!hasZeroes(grid));
    });

    it('fills a semi-filled grid', function() {
        grid[1][1] = 1;
        fillGrid(grid, 0.2, width, height);
        assert(!hasZeroes(grid));
    });

    it('will not change an already-filled grid', function() {
        let trueResult = [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ];
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                grid[i][j] = 1;
            }
        }
        fillGrid(grid, 0.2, width, height);
        assert.deepStrictEqual(grid, trueResult);
    });
});

describe('buildMagicObj', function() {
    let grid;
    let width = 3;
    let height = 3;
    let canvasWidth = 30;
    let canvasHeight = 30;
    let colors = [];

    beforeEach(() => {
        grid = gridGenerator([], width, height);
    });

    it('throws when empty grid is passed in', function() {
        assert.rejects(buildMagicObj(grid, width, height, canvasWidth, canvasHeight, colors));
    });

    it('throws when colors.length <= 0', function() {
        fillGrid(grid, 1, width, height);
        assert.rejects(buildMagicObj(grid, width, height, canvasWidth, canvasHeight, []));
    });

    it('returns the svg element', function() {
        let counter = fillGrid(grid, 1, width, height);
        assert(counter === 2);
        for (let i = 0; i < counter; i++) {
            colors.push({
                'fill': 'blue',
                'stroke': 'red'
            });
        }

        return buildMagicObj(grid, canvasWidth, canvasHeight, colors).then((returnedObj) => {
            assert(returnedObj.svg.g.rect.length > 0);
        });
    });
});
