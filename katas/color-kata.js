function normalizarHex(valor) {
  var limpio = String(valor).trim().replace(/^#/, "");
  if (!/^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(limpio)) {
    throw new Error("Color hexadecimal invalido");
  }
  if (limpio.length === 3) {
    limpio = limpio
      .split("")
      .map(function (c) {
        return c + c;
      })
      .join("");
  }
  return "#" + limpio.toUpperCase();
}

function rgbDesdeHex(hex) {
  var limpio = normalizarHex(hex).slice(1);
  return {
    r: parseInt(limpio.slice(0, 2), 16),
    g: parseInt(limpio.slice(2, 4), 16),
    b: parseInt(limpio.slice(4, 6), 16)
  };
}

function textoContraste(hex) {
  var rgb = rgbDesdeHex(hex);
  var brillo = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brillo >= 140 ? "#000000" : "#FFFFFF";
}

module.exports = {
  normalizarHex: normalizarHex,
  rgbDesdeHex: rgbDesdeHex,
  textoContraste: textoContraste
};
