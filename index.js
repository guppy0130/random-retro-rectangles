// build the grid here
// let the grid start off as 30x30?
const canvasWidth = 30;
const canvasHeight = 30;

// some runtime vars
const width = 1920;
const height = 1080;
const growthProbability = 0.3;

// fill this in
const magic_string_beginning = `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">`;
const magic_string_ending = '</svg>';
let magic_string_body = '';

const gridGenerator = (grid, canvasWidth, canvasHeight) => {
    for (let i = 0; i < canvasWidth; i++) {
        grid[i] = [];
        for (let j = 0; j < canvasHeight; j++) {
            grid[i][j] = 0;
        }
    }
    return grid;
};

const probability = (p) => {
    // returns a function that will return T with probability P.
    // good for reuse.
    let returnable = () => {
        if (Math.random() < p) {
            return true;
        } else {
            return false;
        }
    };
    return returnable;
};

// canMove assumes that the current position is valid.
const canMove = {
    north: (grid, x, y) => {
        return (y - 1 >= 0 && grid[x][y - 1] == 0);
    },
    east: (grid, x, y) => {
        return (x + 1 <= grid[0].length - 1 && grid[x + 1][y] == 0);
    },
    south: (grid, x, y) => {
        return (y + 1 <= grid.length - 1 && grid[x][y + 1] == 0);
    },
    west: (grid, x, y) => {
        return (x - 1 >= 0 && grid[x - 1][y] == 0);
    }
};

const grow = (grid, x, y, i, p) => {
    // this attempts to grow (x,y) by 1u in all directions with probability p.
    // it first checks to see if it can grow in that direction,
    // then attempts to change that unit if allowed.
    // returns where it has grown to.
    // assumes that grid[x][y] == i already.

    let shouldGrow = probability(p);
    let grownTo = [];

    // north
    if (canMove.north(grid, x, y) && shouldGrow()) {
        grid[x][y - 1] = i;
        grownTo.push((x, y - 1));
    }

    // east
    if (canMove.east(grid, x, y) && shouldGrow()) {
        grid[x + 1][y] = i;
        grownTo.push((x + 1, y));
    }

    // south
    if (canMove.south(grid, x, y) && shouldGrow()) {
        grid[x][y + 1] = i;
        grownTo.push((x, y + 1));
    }

    // west
    if (canMove.west(grid, x, y) && shouldGrow()) {
        grid[x - 1][y] = i;
        grownTo.push((x - 1, y));
    }
    return grownTo;
};

// console.table(grid);

const magic_string = magic_string_beginning + magic_string_body + magic_string_ending;

module.exports = {
    canMove,
    gridGenerator,
    grow
};
