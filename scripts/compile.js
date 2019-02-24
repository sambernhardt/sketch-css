var beautify = require('beautify');
const fs = require('fs');
var ns = require('node-sketch')
var cssConverter = require('styleflux');
var compileTextStyles = require('./textStyles');
var compileLayerStyles = require('./layerStyles');
var compileSymbolStyles = require('./symbolStyles');
var sass = require('sass');

function compile() {
  ns.read('./design.sketch').then(sketch => {
    var styles = [];

    compileTextStyles.compile(sketch, function(textStyles) {
      styles = styles.concat(textStyles);

      compileSymbolStyles.compile(sketch, function(layerStyles) {
        styles = styles.concat(layerStyles);
      })

      styles = beautify(styles.join('\n'), {format: "css"});
    })

    // write raw file
    fs.writeFile('./site/styles.css', styles, (err) => {
      if (err) console.log(err);
      console.log("CSS written.");
    });
  })
}

module.exports = {
  compile: function() {
    compile()
  }
}
