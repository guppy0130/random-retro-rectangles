/**
 * sets up `grid` to be `width` by `height`, zero-filled.
 */
const gridGenerator = (grid, width, height) => {
    for (let i = 0; i < width; i++) {
        grid[i] = [];
        for (let j = 0; j < height; j++) {
            grid[i][j] = 0;
        }
    }
    return grid;
};

/**
 * returns a function that will return T with probability P.
 * good for reuse.
 */
const probability = (p) => {
    let returnable = () => {
        if (Math.random() < p) {
            return true;
        } else {
            return false;
        }
    };
    return returnable;
};

/**
 * returns true if a valid move. returns false if off board.
 * eslint no-unused-vars is disabled so all functions have the same parameters.
 */
/* eslint-disable no-unused-vars */
const canMove = {
    north: (grid, x, y) => {
        return (y - 1 >= 0);
    },
    east: (grid, x, y) => {
        return (x + 1 <= grid.length - 1);
    },
    south: (grid, x, y) => {
        return (y + 1 <= grid[0].length - 1);
    },
    west: (grid, x, y) => {
        return (x - 1 >= 0);
    }
};
/* eslint-enable no-unused-vars */

/**
 * canGrow assumes that the current position is valid.
 */
const canGrow = {
    north: (grid, x, y) => {
        return (canMove.north(grid, x, y) && grid[x][y - 1] == 0);
    },
    east: (grid, x, y) => {
        return (canMove.east(grid, x, y) && grid[x + 1][y] == 0);
    },
    south: (grid, x, y) => {
        return (canMove.south(grid, x, y) && grid[x][y + 1] == 0);
    },
    west: (grid, x, y) => {
        return (canMove.west(grid, x, y) && grid[x - 1][y] == 0);
    }
};

/**
 * attempts to grow (x,y) by 1u in all directions with probability p.
 * it first checks to see if it can grow in that direction,
 * then attempts to change that unit if allowed.
 * returns where it has grown to.
 * assumes that grid[x][y] == i already.
 */
const grow = (grid, x, y, i, p) => {
    let shouldGrow = probability(p);
    let grownTo = [];

    // north
    if (canGrow.north(grid, x, y) && shouldGrow()) {
        grid[x][y - 1] = i;
        grownTo.push((x, y - 1));
    }

    // east
    if (canGrow.east(grid, x, y) && shouldGrow()) {
        grid[x + 1][y] = i;
        grownTo.push((x + 1, y));
    }

    // south
    if (canGrow.south(grid, x, y) && shouldGrow()) {
        grid[x][y + 1] = i;
        grownTo.push((x, y + 1));
    }

    // west
    if (canGrow.west(grid, x, y) && shouldGrow()) {
        grid[x - 1][y] = i;
        grownTo.push((x - 1, y));
    }
    return grownTo;
};

/**
 * checks to see if there are zeroes
 */
const hasZeroes = (grid) => {
    for (const array of grid) {
        if (array.some(elem => {
            return elem === 0;
        })) {
            return true;
        }
    }
    return false;
};

/**
 * repeatedly calls grow() with incrementing values until the grid is nonzero.
 */
const fillGrid = (grid, p, width, height) => {
    let counter = 1;
    if (p === 0) {
        // ...well, then you can't grow?
        throw new Error('Cannot fill a grid with growth probability zero');
    }
    if (grid.length === 1 && grid[0].length === 1) {
        grid[0][0] = 1;
    }
    while (hasZeroes(grid)) {
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                grow(grid, i, j, counter, p);
            }
        }
        counter++;
    }
    return counter;
};

/**
 * returns an object for SVG stringification.
 */
const buildMagicObj = async (grid, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor) => {
    // the grid should not have any zeroes.
    if (hasZeroes(grid)) {
        throw new Error('no zeroes in final grid');
    }
    // the colors should be defined.
    if (colors.length <= 0) {
        throw new Error('colors must be nonzero length array');
    }

    if (transform) {
        canvasWidth *= factor;
        canvasHeight *= factor;
    }

    let width = grid.length;
    let height = grid[0].length;
    let size = Math.max(canvasWidth / width, canvasHeight / height);

    // a set of squares!
    let rectangles = [];
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            let normalizedWidth = size;
            let normalizedHeight = size;
            let margin = size / 40;
            let color = colors[(grid[i][j]) % colors.length].fill;
            let baseRectangle = (x, y) => {
                return {
                    'width': normalizedWidth - margin * 3,
                    'height': normalizedHeight - margin * 3,
                    'x': normalizedWidth * (i + x) + margin,
                    'y': normalizedHeight * (j + y) + margin,
                    'fill': color,
                    // 'stroke': colors[grid[i][j] - 1].stroke,
                    'rx': margin * 10,
                    'ry': margin * 10
                };
            };
            rectangles.push({
                '$': baseRectangle(0, 0)
            });
            // add more rectangles for merging

            // south
            if (canMove.south(grid, i, j) && grid[i][j + 1] == grid[i][j]) {
                rectangles.push({
                    '$': baseRectangle(0, 0.5)
                });
            }
            // east
            if (canMove.east(grid, i, j) && grid[i + 1][j] == grid[i][j]) {
                rectangles.push({
                    '$': baseRectangle(0.5, 0)
                });
            }
            // and in the all direction case?
            // so it has south, east, and southeast.
            if (canMove.east(grid, i, j) && canMove.south(grid, i, j) && canMove.east(grid, i, j+1) && grid[i+1][j] == grid[i][j] && grid[i][j+1] == grid[i][j] && grid[i+1][j+1] == grid[i][j]) {
                rectangles.push({
                    '$': baseRectangle(0.25, 0.25)
                });
            }
        }
    }

    if (transform) {
        canvasWidth /= factor;
        canvasHeight /= factor;
    }

    // the grid passes checks. generate the obj and return it.
    let rootObj = {
        width: canvasWidth,
        height: canvasHeight,
        version: 1.1,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: `0 0 ${canvasWidth} ${canvasHeight}`
    };
    let g = {
        'rect': rectangles
    };
    // some optional params
    if (backgroundColor) {
        rootObj['style'] = `background-color: ${backgroundColor}`;
    }
    if (transform) {
        g['$'] = {
            width: Math.max(canvasWidth, canvasHeight) * factor,
            height: Math.max(canvasWidth, canvasHeight) * factor,
            transform: `rotate(45) translate(-${Math.max(canvasWidth, canvasHeight) / 2} -${Math.max(canvasWidth, canvasHeight) / 2})`,
            'transform-origin': 'center'
        };
    }
    let svg = {
        svg: {
            $: rootObj,
            'g': g
        }
    };
    return svg;
};

module.exports = {
    canGrow,
    gridGenerator,
    grow,
    buildMagicObj,
    hasZeroes,
    fillGrid,
};
