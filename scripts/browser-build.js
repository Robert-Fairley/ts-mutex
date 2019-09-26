const browserify = require("browserify");
const tsify = require("tsify");
const fs = require("fs");

browserify()
    .add("./src/mutex.ts")
    .plugin(tsify)
    .bundle()
    .on("error", console.error)
    .pipe(fs.createWriteStream("./lib/mutex.browser.js"));
