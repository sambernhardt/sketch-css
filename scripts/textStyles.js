var color = require('color');
var sketchColors = require('./sketchColors');
const translateFontWeight = require('translate-font-weight');

module.exports = {
  compile: function(sketch, callback) {
    var styles = {
      Desktop: [],
      Mobile: [`@media only screen and (max-width: 600px) {`]
    };

    sketch.textStyles.forEach((styleItem, i) => {
      var textStyleName = styleItem.name;
      // get device name
      var device = textStyleName.split('/')[0];
      textStyleName = textStyleName.split('/')[1];

      // initialize style block
      var styleBlock = [`${textStyleName} {`];
      var textStylesObject = styleItem.value.textStyle.encodedAttributes;

      // color
      var textColor = sketchColors.convert(textStylesObject.MSAttributedStringColorAttribute);
      styleBlock.push(`color: ${textColor};`)

      // font
      var fontStyles = textStylesObject.MSAttributedStringFontAttribute.attributes;
      var fontSplit = fontStyles.name.split('-'); //split the name to get the width at the end
      var fontName = fontSplit[0].split(/(?=[A-Z])/);

      var font = {
        name: fontName.join(" "),
        originalName: fontStyles.name,
        weight: fontSplit[1] ? translateFontWeight(fontSplit[1]) : 400,
        textWeight: fontSplit[1],
        size: fontStyles.size
      };

      styleBlock.push(`font-family: '${font.name}'; /* full name: ${font.originalName}; */`)
      styleBlock.push(`font-weight: ${font.weight};`)
      styleBlock.push(`font-size: ${font.size}px;`)

      if (textStylesObject.paragraphStyle.maximumLineHeight) {
        var lineHeight = textStylesObject.paragraphStyle.maximumLineHeight;
        styleBlock.push(`line-height: ${lineHeight};`)
      }

      if (textStylesObject.kerning) {
        styleBlock.push(`letter-spacing: ${textStylesObject.kerning}px;`)
      }

      styleBlock.push(`}`)
      styles[device].push(styleBlock.join('\n'))
    });

    // add closing tag to media query
    styles['Mobile'].push('}');

    // join desktop and mobile styles
    var exportedStyles = styles['Desktop'].concat(styles['Mobile']);

    callback(exportedStyles);
  }
};
