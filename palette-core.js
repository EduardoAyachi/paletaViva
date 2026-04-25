(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PaletaVivaCore = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var nombresAprox = [
    { n: "Negro", r: 0, g: 0, b: 0 },
    { n: "Blanco", r: 255, g: 255, b: 255 },
    { n: "Rojo", r: 220, g: 40, b: 40 },
    { n: "Verde", r: 50, g: 160, b: 80 },
    { n: "Azul", r: 50, g: 90, b: 200 },
    { n: "Amarillo", r: 240, g: 220, b: 60 },
    { n: "Naranja", r: 230, g: 120, b: 40 },
    { n: "Rosa", r: 230, g: 120, b: 160 },
    { n: "Morado", r: 140, g: 80, b: 180 },
    { n: "Marron", r: 120, g: 75, b: 50 },
    { n: "Gris", r: 140, g: 140, b: 145 },
    { n: "Turquesa", r: 50, g: 180, b: 175 },
    { n: "Beige", r: 220, g: 205, b: 175 },
    { n: "Oro", r: 200, g: 165, b: 60 },
    { n: "Coral", r: 240, g: 130, b: 110 }
  ];

  function distanciaColor(r1, g1, b1, r2, g2, b2) {
    var dr = r1 - r2;
    var dg = g1 - g2;
    var db = b1 - b2;
    return dr * dr + dg * dg + db * db;
  }

  function nombreAproximado(r, g, b) {
    var mejor = nombresAprox[0];
    var dmin = distanciaColor(r, g, b, mejor.r, mejor.g, mejor.b);
    for (var i = 1; i < nombresAprox.length; i++) {
      var c = nombresAprox[i];
      var d = distanciaColor(r, g, b, c.r, c.g, c.b);
      if (d < dmin) {
        dmin = d;
        mejor = c;
      }
    }
    return "~" + mejor.n;
  }

  function hexDeRgb(r, g, b) {
    function h(x) {
      var s = x.toString(16);
      return s.length === 1 ? "0" + s : s;
    }
    return "#" + h(r) + h(g) + h(b);
  }

  function cuantizar(r, g, b, paso) {
    return (
      Math.floor(r / paso) * paso +
      "," +
      Math.floor(g / paso) * paso +
      "," +
      Math.floor(b / paso) * paso
    );
  }

  function extraerPaletaDesdePixeles(pixeles, maxColores, opciones) {
    var config = opciones || {};
    var paso = config.paso || 24;
    var alphaMinimo = config.alphaMinimo || 128;
    var minDist = config.minDist || 1800;
    var mapa = {};
    var i;
    for (i = 0; i < pixeles.length; i += 4) {
      var a = pixeles[i + 3];
      if (a < alphaMinimo) continue;
      var r = pixeles[i];
      var g = pixeles[i + 1];
      var b = pixeles[i + 2];
      var clave = cuantizar(r, g, b, paso);
      if (!mapa[clave]) {
        mapa[clave] = { r: 0, g: 0, b: 0, n: 0 };
      }
      var bucket = mapa[clave];
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    }
    var lista = [];
    for (var k in mapa) {
      if (Object.prototype.hasOwnProperty.call(mapa, k)) {
        var m = mapa[k];
        lista.push({
          r: Math.round(m.r / m.n),
          g: Math.round(m.g / m.n),
          b: Math.round(m.b / m.n),
          cuenta: m.n
        });
      }
    }
    lista.sort(function (a, b) {
      return b.cuenta - a.cuenta;
    });
    var resultado = [];
    var cand;
    var ok;
    var j;
    var ex;
    for (i = 0; i < lista.length && resultado.length < maxColores; i++) {
      cand = lista[i];
      ok = true;
      for (j = 0; j < resultado.length; j++) {
        ex = resultado[j];
        if (distanciaColor(cand.r, cand.g, cand.b, ex.r, ex.g, ex.b) < minDist) {
          ok = false;
          break;
        }
      }
      if (ok) resultado.push(cand);
    }
    if (resultado.length < maxColores) {
      for (i = 0; i < lista.length && resultado.length < maxColores; i++) {
        cand = lista[i];
        ok = true;
        for (j = 0; j < resultado.length; j++) {
          ex = resultado[j];
          if (cand.r === ex.r && cand.g === ex.g && cand.b === ex.b) {
            ok = false;
            break;
          }
        }
        if (ok) resultado.push(cand);
      }
    }
    return resultado.slice(0, maxColores);
  }

  return {
    distanciaColor: distanciaColor,
    nombreAproximado: nombreAproximado,
    hexDeRgb: hexDeRgb,
    cuantizar: cuantizar,
    extraerPaletaDesdePixeles: extraerPaletaDesdePixeles
  };
});
