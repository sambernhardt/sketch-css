var chokidar = require('chokidar');
var sketchCSSCompile = require('./scripts/compile');

// compile on initial run
sketchCSSCompile.compile('./design.sketch', './site/styles.css');

// watch for changes to the sketch file and run the compiler
chokidar.watch('./design.sketch').on("change", () => {
  sketchCSSCompile.compile('./design.sketch', './site/styles.css');
})
