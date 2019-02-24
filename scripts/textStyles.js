var color = require('color');
var sketchColors = require('./sketchColors');
const translateFontWeight = require('translate-font-weight');
const fs = require('fs');
var ns = require('node-sketch')
const cssConverter = require('styleflux');

module.exports = {
  compile: function(sketch, callback) {
    var list = [];
    var textStyles = sketch.textStyles;
    var styles = {
      Desktop: [],
      Mobile: [`@media only screen and (max-width: 600px) {`]
    };
    // var deviceWidths = {
    //   'Mobile': 600
    // }

    textStyles.forEach(styleItem => {
      var textStyleName = styleItem.name;
      var textStylesObject = styleItem.value.textStyle.encodedAttributes;

      // get device name
      var device = textStyleName.split('/')[0];
      textStyleName = textStyleName.split('/')[1];

      // color
      var textColor = sketchColors.convert(textStylesObject.MSAttributedStringColorAttribute);

      // font
      var fontStyles = textStylesObject.MSAttributedStringFontAttribute.attributes;
      var fontName = fontStyles.name.split('-');
      fontName[2] = fontName[1] == undefined ? 400 : translateFontWeight(fontName[1]);
      var fontSize = fontStyles.size;

      if (device == 'Desktop') {
        styles['Desktop'].push(`
          ${textStyleName} {
            font-family: '${fontName[0]}'; /* full name: ${fontName[0]}-${fontName[1]}; */
            font-weight: ${fontName[2]};
            font-size: ${fontSize}px;
            color: ${textColor};
          }`);
      } else {
        styles['Mobile'].push(`
          ${textStyleName} {
            font-family: '${fontName[0]}'; /* full name: ${fontName[0]}-${fontName[1]}; */
            font-weight: ${fontName[2]};
            font-size: ${fontSize}px;
            color: ${textColor};
          }`);
      }
    });

    styles['Mobile'].push('}');
    var exportedStyles = styles['Desktop'].concat(styles['Mobile']);

    callback(exportedStyles);
  }
};
