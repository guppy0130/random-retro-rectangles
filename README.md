# Random Retro Rectangles

## Pretty, generative wallpapers

[![Build Status](https://travis-ci.com/guppy0130/random-retro-rectangles.svg?branch=master)](https://travis-ci.com/guppy0130/random-retro-rectangles)

```bash
git clone https://github.com/guppy0130/random-retro-rectangles.git
npm i
npm start 
```

```http
POST / HTTP/1.1
Host: http://localhost:3000/
Content-Type: application/json; charset=utf-8
Content-Length: 142

{
    "density": 16,
    "canvasWidth": 1600,
    "canvasHeight": 900,
    "p": 10,
    "transform": false,
    "backgroundColor": "#01172f"
}
```
