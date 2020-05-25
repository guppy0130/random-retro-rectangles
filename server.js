const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const whiskers = require('whiskers');
const gm = require('gm');

// import self
const {
    gridGenerator,
    buildMagicObj,
    fillGrid
} = require('./index');

// import stuff to build svg
const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder({
    headless: true,
    renderOpts: {
        pretty: false
    }
});

// body-parser
app.use(bodyParser.json());

// template engine
app.engine('.html', whiskers.__express);
app.set('views', __dirname);
// heroku
app.enable('trust proxy');

// some defaults so buildMagicObj doesn't break.
// also, backgroundColor
const someColors = ['00bdaa','400082','fe346e','f1e7b6'];
const prebuiltColors = [];
for (let i = 0; i < someColors.length; i++) {
    for (let j = 0; j < someColors.length; j++) {
        prebuiltColors.push({
            'fill': `#${someColors[j]}`,
            'stroke': `#${someColors[i]}`,
        });
    }
}

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/**
 * Generate the grid, filled in. This is abstracted out for different consumers.
 * @param {Number} p 0-1 probability of merge
 * @param {Number} width width of square-space
 * @param {Number} height height of square-space
 * @param {Number} canvasWidth width of canvas
 * @param {Number} canvasHeight height of canvas
 * @param {Array} colors array of colors
 * @param {String} backgroundColor canvas background color
 * @param {boolean} transform rotate square-space
 * @param {Number} factor multiplier for how many squares to make
 */
const getMagicObj = async (p, width, height, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor) => {
    // generate grid
    let grid = gridGenerator([], width, height);
    fillGrid(grid, p, width, height);

    colors = shuffle(colors);

    return await buildMagicObj(grid, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor);
};

// routes

app.post('/png', async (req, res) => {
    let { density, canvasWidth, canvasHeight, colors, p, backgroundColor, transform } = req.body;

    // if any args are null, send 400
    if (density === undefined ||
        canvasWidth === undefined ||
        canvasHeight === undefined ||
        p === undefined ||
        p <= 0) {
        return res.status(400).send('Bad params');
    }

    // set vars
    // just pass a density since we're always making squares
    let factor = 1;
    if (transform) {
        factor = Math.ceil(Math.sqrt(2));
    }
    width = density * factor;
    height = density * factor;

    // add more colors!
    if (colors == null || colors.length === 0) {
        colors = prebuiltColors;
    }
    backgroundColor = backgroundColor ? backgroundColor : '#ffffff';

    // p is probability of merge
    p = 1 / p;

    let { svg } = await getMagicObj(p, width, height, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor);

    let rectArr = svg.g.rect;
    let img = gm(svg.g['$'].width, svg.g['$'].height, backgroundColor);

    for (let rect of rectArr) {
        let {width, height, x, y, fill, rx, ry} = rect['$'];
        img.fill(fill);
        img.drawRectangle(x, y, x + width, y + height, rx, ry);
    }

    if (transform) {
        img.rotate(backgroundColor, 45);
    }
    img.gravity('Center');
    img.crop(canvasWidth, canvasHeight);

    res.type('image/png');
    return img.stream('png').pipe(res);
});

app.post('/', async (req, res) => {
    let { density, canvasWidth, canvasHeight, colors, p, backgroundColor, transform } = req.body;

    // if any args are null, send 400
    if (density === undefined ||
        canvasWidth === undefined ||
        canvasHeight === undefined ||
        p === undefined ||
        p <= 0) {
        return res.status(400).send('Bad params');
    }

    // set vars
    // just pass a density since we're always making squares
    let factor = 1;
    if (transform) {
        factor = Math.ceil(Math.sqrt(2));
    }
    width = density * factor;
    height = density * factor;

    // add more colors!
    if (colors == null || colors.length === 0) {
        colors = prebuiltColors;
    }

    // p is probability of merge
    p = 1 / p;

    let svgObj = await getMagicObj(p, width, height, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor);
    let svg = xmlBuilder.buildObject(svgObj);
    return res.send(svg);
});

app.get('/', (req, res) => {
    return res.render('index.html', {
        url: `${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
