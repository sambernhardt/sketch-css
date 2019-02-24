var color = require('color');
var sketchColors = require('./sketchColors');
const translateFontWeight = require('translate-font-weight');

function findLayer(layers, layerName) {
  return layers.filter(layer => layer.name == layerName);
}

module.exports = {
  compile: function(sketch, callback) {
    var symbols = sketch.symbols;

    var styles = [];
    symbols.forEach(symbol => {
      console.log(symbol.name);

    });

    callback(styles);
  }
};
