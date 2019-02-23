var beautify = require('beautify');
const fs = require('fs');
var ns = require('node-sketch')
var compileTextStyles = require('./textStyles');
var compileLayerStyles = require('./layerStyles');

function compile() {
  ns.read('./design.sketch').then(sketch => {
    var list = [];

    var styles = ["body {-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}"];
    // console.log(sketch);

    compileTextStyles.compile(sketch, function(textStyles) {
      styles = styles.concat(textStyles);

      compileLayerStyles.compile(sketch, function(layerStyles) {
        styles = styles.concat(layerStyles);
      })

      styles = beautify(styles.join('\n'), {format: "css"});
    })

    fs.writeFile('./site/styles.css', styles, (err) => {
      if (err) console.log(err);
      console.log("Styles written.");
    });
  })
}

module.exports = {
  compile: function() {
    compile()
  }
}
