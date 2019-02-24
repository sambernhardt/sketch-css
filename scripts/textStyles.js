var color = require('color');
var sketchColors = require('./sketchColors');
const translateFontWeight = require('translate-font-weight');

module.exports = {
  compile: function(sketch, callback) {
    var styles = {
      Desktop: [],
      Mobile: [`@media only screen and (max-width: 600px) {`]
    };

    sketch.textStyles.forEach(styleItem => {
      var textStyleName = styleItem.name;
      // get device name
      var device = textStyleName.split('/')[0];
      textStyleName = textStyleName.split('/')[1];

      var textStylesObject = styleItem.value.textStyle.encodedAttributes;

      // color
      var textColor = sketchColors.convert(textStylesObject.MSAttributedStringColorAttribute);

      // font
      var fontStyles = textStylesObject.MSAttributedStringFontAttribute.attributes;
      var fontSplit = fontStyles.name.split('-'); //split the name to get the width at the end
      var font = {
        name: fontSplit[0],
        originalName: fontStyles.name,
        weight: translateFontWeight(fontSplit[1]),
        textWeight: fontSplit[1],
        size: fontStyles.size
      };
      // fontName[2] = fontName[1] == undefined ? 400 : translateFontWeight(fontName[1]);

      if (device == 'Desktop') {
        styles['Desktop'].push(`
          ${textStyleName} {
            font-family: '${font.name}'; /* full name: ${font.originalName}; */
            font-weight: ${font.weight};
            font-size: ${font.size}px;
            color: ${textColor};
          }`);
      } else {
        styles['Mobile'].push(`
          ${textStyleName} {
            font-family: '${font.name}'; /* full name: ${font.originalName}; */
            font-weight: ${font.weight};
            font-size: ${font.size}px;
            color: ${textColor};
          }`);
      }
    });

    // add closing tag to media query
    styles['Mobile'].push('}');

    // join desktop and mobile styles
    var exportedStyles = styles['Desktop'].concat(styles['Mobile']);

    callback(exportedStyles);
  }
};
