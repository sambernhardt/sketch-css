var chokidar = require('chokidar');
var sketchCSSCompile = require('./scripts/compile');

sketchCSSCompile.compile();
chokidar.watch('./design.sketch').on("change", () => {
  sketchCSSCompile.compile();
})
