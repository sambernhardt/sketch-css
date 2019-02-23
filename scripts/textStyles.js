var color = require('color');
const translateFontWeight = require('translate-font-weight');
const fs = require('fs');
var ns = require('node-sketch')
const cssConverter = require('styleflux');

module.exports = {
  compile: function(sketch, callback) {
    var list = [];
    var textStyles = sketch.textStyles;

    var styles = [];
    textStyles.forEach(styleItem => {
      var textStyleName = styleItem.name;
      // console.log(styleItem.value);
      var textStyles = styleItem.value.textStyle.encodedAttributes;

      // colors
      var {alpha, blue, green, red} = textStyles.MSAttributedStringColorAttribute;
      var rgba = {
        r: Math.round(red * 255),
        g: Math.round(green * 255),
        b: Math.round(blue * 255),
        a: Math.round(alpha * 255)
      }

      // fonts
      var fontStyles = textStyles.MSAttributedStringFontAttribute.attributes;
      var fontName = fontStyles.name.split('-');
      fontName[2] = fontName[1] == undefined ? 400 : translateFontWeight(fontName[1]);
      var fontSize = fontStyles.size;

      styles.push(`
      ${textStyleName} {
        font-family: '${fontName[0]}'; /* full name: ${fontName[0]}-${fontName[1]}; */
        font-weight: ${fontName[2]};
        font-size: ${fontSize}px;
        color: rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a});
      }`);

    });

    callback(styles);
  }
};
