var color = require('color');
var sketchColors = require('../sketchColors');
const translateFontWeight = require('translate-font-weight');

function findLayer(layers, layerName) {
  return layers.filter(layer => layer.name == layerName);
}

module.exports = {
  getStyles: function(symbol) {
    var nameSplit = symbol.name.split(':');

    var elementName = '';
    elementName = nameSplit[0];

    var pseudoSelector = '';
    if (nameSplit.length == 2) {
      pseudoSelector = nameSplit[1];
    } else if (nameSplit.length == 3) {
      pseudoSelector = nameSplit[2]
    }

    var style = '';
    switch(pseudoSelector) {
      case '-webkit-input-placeholder':
        var styleBlock = [];

        // Text
        var textLayer = findLayer(symbol.layers, 'Text')[0];
        var textStyle = textLayer.style.textStyle.encodedAttributes;

        // colors
        var textColor = sketchColors.convert(textStyle.MSAttributedStringColorAttribute);
        styleBlock.push(`color: ${textColor};`)

        // font
        var fontStyles = textStyle.MSAttributedStringFontAttribute.attributes;
        var fontSplit = fontStyles.name.split('-'); //split the name to get the width at the end
        var fontName = fontSplit[0].split(/(?=[A-Z])/);

        var font = {
          name: fontName.join(" "),
          originalName: fontStyles.name,
          weight: fontSplit[1] ? translateFontWeight(fontSplit[1]) : 400,
          textWeight: fontSplit[1],
          size: fontStyles.size
        };

        // styleBlock.push(`font-family: '${font.name}'; /* full name: ${font.originalName}; */`)
        styleBlock.push(`font-family: '${font.name}';`)
        styleBlock.push(`font-weight: ${font.weight};`)
        styleBlock.push(`font-size: ${font.size}px;`)

        style = `${symbol.name} {
          ${styleBlock.join('\n')}
        }`;
        break;
      case 'focus':
        var styleBlock = [];

        var backgroundLayer = findLayer(symbol.layers, 'BG')[0];
        var layerStyle = backgroundLayer.style;

        var sketchBackgroundFill = layerStyle.fills[0];
        var sketchBackgroundColor = layerStyle.fills[0].color;
        var backgroundColor = sketchBackgroundFill.isEnabled ? sketchColors.convert(layerStyle.fills[0].color) : backgroundColor = 'transparent';
        styleBlock.push(`background-color: ${backgroundColor};`)

        var borderRadius = backgroundLayer.fixedRadius;
        styleBlock.push(`border-radius: ${borderRadius}px;`)

        // Border
        var borderColor = sketchColors.convert(layerStyle.borders[0].color);
        var borderWidth = layerStyle.borders[0].thickness;
        styleBlock.push(`border: solid ${borderWidth}px ${borderColor};`)

        // var adjustedName = elementName + pseudoSelector.substr(0, symbol.name.length);
        style = `
          ${symbol.name} {
            ${styleBlock.join('\n')}
            outline: none;
            -webkit-outline: none;
        }`;
        break;
      default:
        var styleBlock = [];

        // Background
        var backgroundLayer = findLayer(symbol.layers, 'BG')[0];
        var layerStyle = backgroundLayer.style;
        var borderRadius = backgroundLayer.fixedRadius;
        styleBlock.push(`border-radius: ${borderRadius}px;`)

        var sketchBackgroundFill = layerStyle.fills[0];
        var sketchBackgroundColor = layerStyle.fills[0].color;
        var backgroundColor = sketchBackgroundFill.isEnabled ? sketchColors.convert(layerStyle.fills[0].color) : backgroundColor = 'transparent';
        styleBlock.push(`background-color: ${backgroundColor};`)

        // Border
        // console.log(layerStyle.value.borders[0].color);
        var borderColor = sketchColors.convert(layerStyle.borders[0].color);
        var borderWidth = layerStyle.borders[0].thickness;
        styleBlock.push(`border: solid ${borderWidth}px ${borderColor};`)

        // Text
        var textLayer = findLayer(symbol.layers, 'Text')[0];
        var textStyle = textLayer.style.textStyle.encodedAttributes;

        // colors
        var textColor = sketchColors.convert(textStyle.MSAttributedStringColorAttribute);
        styleBlock.push(`color: ${textColor};`)

        // font
        var fontStyles = textStyle.MSAttributedStringFontAttribute.attributes;
        var fontSplit = fontStyles.name.split('-'); //split the name to get the width at the end
        var fontName = fontSplit[0].split(/(?=[A-Z])/);

        var font = {
          name: fontName.join(" "),
          originalName: fontStyles.name,
          weight: fontSplit[1] ? translateFontWeight(fontSplit[1]) : 400,
          textWeight: fontSplit[1],
          size: fontStyles.size
        };

        // styleBlock.push(`font-family: '${font.name}'; /* full name: ${font.originalName}; */`)
        styleBlock.push(`font-family: '${font.name}';`)
        styleBlock.push(`font-weight: ${font.weight};`)
        styleBlock.push(`font-size: ${font.size}px;`)

        // Padding
        var padding = [textLayer.frame.y, textLayer.frame.x];
        styleBlock.push(`padding: ${padding[0]}px ${padding[1]}px;`)

        style = `
          ${elementName} {
            ${styleBlock.join('\n')};
          }`;
          // transition-duration: .5s;
          // transition-timing-function: ease-out;
    }

    return style;
  }
}
