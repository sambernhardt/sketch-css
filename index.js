var chokidar = require('chokidar');
var color = require('color');
const translateFontWeight = require('translate-font-weight');
const fs = require('fs');
var ns = require('node-sketch')

run();

function run() {
  ns.read('design.sketch').then(sketch => {
    var list = [];
    var textStyles = sketch.textStyles;

    var styles = ["body {-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}"];
    textStyles.forEach(styleItem => {
      var textStyleName = styleItem.name;
      // console.log(styleItem.value);
      var textStyles = styleItem.value.textStyle.encodedAttributes;

      // colors
      var {alpha, blue, green, red} = textStyles.MSAttributedStringColorAttribute;
      var rgba = {r:Math.round(red*255), g:Math.round(green*255), b:Math.round(blue*255), a:Math.round(alpha*255)}

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

    fs.writeFile('styles.css', styles.join('\n'), (err) => {
      if (err) console.log(err);
      console.log("Styles written.");
    });
  })
}

chokidar.watch('./design.sketch').on("change", () => {
  // ns.read('design.sketch').then(sketch => {
    run();
  // })
})
