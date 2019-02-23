module.exports = {
  convert: function(color) {
    // console.log(color);
    var {alpha, blue, green, red} = color;
    return `rgba(${Math.round(red * 255)}, ${Math.round(green * 255)}, ${Math.round(blue * 255)}, ${Math.round(alpha * 255)})`;
  }
}
