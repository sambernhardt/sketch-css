var color = require('color');
var sketchColors = require('../sketchColors');
const translateFontWeight = require('translate-font-weight');

function findLayer(layers, layerName) {
  return layers.filter(layer => layer.name == layerName);
}

module.exports = {
  getStyles: function(symbol) {
    var nameSplit = symbol.name.split('::');
    var elementName = nameSplit[0];
    var pseudoSelector = nameSplit[1];

    var style = '';
    switch(pseudoSelector) {
      case '-webkit-input-placeholder':
        // Text
        var textLayer = findLayer(symbol.layers, 'Text')[0];
        var textStyle = textLayer.style.textStyle.encodedAttributes;

        // colors
        var textColor = sketchColors.convert(textStyle.MSAttributedStringColorAttribute);
        // console.log(textColor);

        // fonts
        var fontStyles = textStyle.MSAttributedStringFontAttribute.attributes;
        var fontName = fontStyles.name.split('-');
        fontName[2] = fontName[1] == undefined ? 400 : translateFontWeight(fontName[1]);
        var fontSize = fontStyles.size;

        style = `
          ${symbol.name} {
            font-family: '${fontName[0]}'; /* full name: ${fontName[0]}-${fontName[1]}; */
            font-weight: ${fontName[2]};
            font-size: ${fontSize}px;
            color: ${textColor};
        }`;
        break;
      case 'focus':
        var backgroundLayer = findLayer(symbol.layers, 'BG')[0];
        var layerStyle = backgroundLayer.style;
        // Border
        // console.log(layerStyle.value.borders[0].color);
        var borderColor = sketchColors.convert(layerStyle.borders[0].color);
        var borderWidth = layerStyle.borders[0].thickness;

        style = `
          ${symbol.name} {
            border: solid ${borderWidth}px ${borderColor};
            outline: none;
            -webkit-outline: none;
        }`;
        break;
      default:
        // Background
        var backgroundLayer = findLayer(symbol.layers, 'BG')[0];
        var layerStyle = backgroundLayer.style;
        var borderRadius = backgroundLayer.fixedRadius;
        // console.log(JSON.stringify(backgroundLayer.points, null, 4));

        var sketchBackgroundFill = layerStyle.fills[0];
        var sketchBackgroundColor = layerStyle.fills[0].color;
        var backgroundColor = sketchBackgroundFill.isEnabled ? sketchColors.convert(layerStyle.fills[0].color) : backgroundColor = 'transparent';

        // Border
        // console.log(layerStyle.value.borders[0].color);
        var borderColor = sketchColors.convert(layerStyle.borders[0].color);
        var borderWidth = layerStyle.borders[0].thickness;

        // Text
        var textLayer = findLayer(symbol.layers, 'Text')[0];
        var textStyle = textLayer.style.textStyle.encodedAttributes;

        // colors
        var textColor = sketchColors.convert(textStyle.MSAttributedStringColorAttribute);
        // console.log(textColor);

        // fonts
        var fontStyles = textStyle.MSAttributedStringFontAttribute.attributes;
        var fontName = fontStyles.name.split('-');
        fontName[2] = fontName[1] == undefined ? 400 : translateFontWeight(fontName[1]);
        var fontSize = fontStyles.size;

        // Padding
        var padding = [textLayer.frame.y, textLayer.frame.x];

        style = `
          ${elementName} {
            font-family: '${fontName[0]}'; /* full name: ${fontName[0]}-${fontName[1]}; */
            font-weight: ${fontName[2]};
            font-size: ${fontSize}px;
            color: ${textColor};
            background-color: ${backgroundColor};
            border-radius: ${borderRadius}px;
            border: solid ${borderWidth}px ${borderColor};
            padding: ${padding[0]}px ${padding[1]}px;
          }`;
    }

    return style;
  }
}
