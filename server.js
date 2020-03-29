const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const whiskers = require('whiskers');

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
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

app.post('/', async (req, res) => {
    let { density, canvasWidth, canvasHeight, colors, p, backgroundColor, transform } = req.body;

    // if any args are null, send 400
    if (density === undefined ||
        canvasWidth === undefined ||
        canvasHeight === undefined ||
        p === undefined ||
        p <= 0) {
        return res.status(400).send('Bad params');
    } else if (colors == null) {
        colors = [];
    }

    // just pass a density since we're always making squares
    let factor = 1;
    if (transform) {
        factor = Math.ceil(Math.sqrt(2));
    }
    let width = density * factor;
    let height = density * factor;

    // generate grid
    p = 1 / p;
    let grid = gridGenerator([], width, height);
    fillGrid(grid, p, width, height);

    // add more colors!
    colors = colors.concat(prebuiltColors);

    if (backgroundColor) {
        colors.push({
            'fill': backgroundColor,
            'stroke': backgroundColor
        });
    }

    colors = shuffle(colors);

    const svgObj = await buildMagicObj(grid, canvasWidth, canvasHeight, colors, backgroundColor, transform, factor);
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
