const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// import self
const maker = require('./index');

app.get('/', (req, res) => {
    res.send(magic_string);
});

app.listen(port, () => {
    // console.log(`Listening on ${port}`);
});
