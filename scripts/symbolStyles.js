var input = require('./symbolStyles/input');

module.exports = {
  compile: function(sketch, callback) {
    var symbols = sketch.symbols;

    var styles = [];
    symbols.forEach(symbol => {
      var name = symbol.name.split(':');

      switch(name[0]) {
        case 'input':
          styles.push(input.getStyles(symbol));
          break;
        default:
      }
    });

    callback(styles);
  }
};
