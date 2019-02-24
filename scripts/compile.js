var beautify = require('cssbeautify');
var cssConverter = require('styleflux');
var fs = require('fs');
var ns = require('node-sketch')
var sass = require('sass');

var compileSymbolStyles = require('./symbolStyles');
var compileTextStyles = require('./textStyles');

module.exports = {
  compile: function(sketchFile, dest) {
    ns.read(sketchFile).then(sketch => {
      var styles = [];

      // Compile Text Styles
      compileTextStyles.compile(sketch, function(textStyles) {
        styles = styles.concat(textStyles);

        // Compile Symbol Styles
        compileSymbolStyles.compile(sketch, function(layerStyles) {
          styles = styles.concat(layerStyles);
        })

        // Combine array of lines into string of text
        var combinedStyles = styles.join('\n');
        // Beautify
        styles = beautify(combinedStyles, {indent: "  "});
      })

      // Write CSS to file
      fs.writeFile(dest, styles, (err) => {
        if (err) console.log(err);
        console.log("CSS written.");
      });
    })
  }
}
