var color = require('color');
var sketchColors = require('./sketchColors');
const translateFontWeight = require('translate-font-weight');
const fs = require('fs');
var ns = require('node-sketch')
const cssConverter = require('styleflux');

module.exports = {
  compile: function(sketch, callback) {
    var list = [];
    var layerStyles = sketch.layerStyles;

    var styles = [];
    layerStyles.forEach(layerStyle => {

      // Background
      // console.log(layerStyle.value.fills[0]);
      var sketchBackgroundFill = layerStyle.value.fills[0];
      var sketchBackgroundColor = layerStyle.value.fills[0].color;
      var backgroundColor = sketchBackgroundFill.isEnabled ? sketchColors.convert(layerStyle.value.fills[0].color) : backgroundColor = 'transparent';

      // Border
      // console.log(layerStyle.value.borders[0].color);
      var borderColor = sketchColors.convert(layerStyle.value.borders[0].color);
      var borderWidth = layerStyle.value.borders[0].thickness;

      // Padding
      var padding = layerStyle.name.split('-');
      padding.shift();

      var layerStyleName = layerStyle.name.split('-')[0];

      styles.push(`
      ${layerStyleName} {
        background-color: ${backgroundColor};
        border: solid ${borderWidth}px ${borderColor};
        padding: ${padding[0]}px ${padding[1]}px;
      }`);

    });

    callback(styles);
  }
};
