(function () {
  "use strict";
  var zona = document.getElementById("zona-carga");
  var inputArchivo = document.getElementById("input-archivo");
  var btnArchivo = document.getElementById("btn-archivo");
  var aviso = document.getElementById("aviso");
  var seccionVista = document.getElementById("seccion-vista");
  var imgVista = document.getElementById("img-vista");
  var btnOtra = document.getElementById("btn-otra");
  var seccionPaletas = document.getElementById("seccion-paletas");
  var listaColores = document.getElementById("lista-colores");
  var pistaCopia = document.getElementById("pista-copia");
  var canvas = document.getElementById("canvas-trabajo");
  var ctx = canvas.getContext("2d", { willReadFrequently: true });
  var blobUrlActiva = null;

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
    { n: "Marrón", r: 120, g: 75, b: 50 },
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

  function extraerPaleta(imageElement, maxColores) {
    var w = imageElement.naturalWidth;
    var h = imageElement.naturalHeight;
    if (!w || !h) return [];

    var lado = 80;
    var cw = lado;
    var ch = Math.max(1, Math.round((h / w) * lado));
    canvas.width = cw;
    canvas.height = ch;
    ctx.drawImage(imageElement, 0, 0, cw, ch);
    var datos;
    try {
      datos = ctx.getImageData(0, 0, cw, ch);
    } catch (err) {
      return [];
    }
    var pix = datos.data;
    var mapa = {};
    var paso = 24;
    var i;
    var step = 4;
    for (i = 0; i < pix.length; i += step) {
      var a = pix[i + 3];
      if (a < 128) continue;
      var r = pix[i];
      var g = pix[i + 1];
      var b = pix[i + 2];
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
    var minDist = 1800;
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

  function mostrarAviso(texto, esOk) {
    aviso.textContent = texto || "";
    aviso.classList.toggle("ok", !!esOk);
  }

  function renderPaleta(colores) {
    listaColores.innerHTML = "";
    colores.forEach(function (c) {
      var hex = hexDeRgb(c.r, c.g, c.b);
      var li = document.createElement("li");
      li.className = "item-color";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-color";
      btn.setAttribute("aria-label", "Copiar color " + hex);
      var muestra = document.createElement("div");
      muestra.className = "muestra";
      muestra.style.backgroundColor = hex;
      var meta = document.createElement("div");
      meta.className = "meta-color";
      var spanHex = document.createElement("span");
      spanHex.className = "hex";
      spanHex.textContent = hex.toUpperCase();
      var spanNom = document.createElement("span");
      spanNom.className = "nombre-auto";
      spanNom.textContent = nombreAproximado(c.r, c.g, c.b);
      meta.appendChild(spanHex);
      meta.appendChild(spanNom);
      btn.appendChild(muestra);
      btn.appendChild(meta);
      btn.addEventListener("click", function () {
        copiarHex(hex);
      });
      li.appendChild(btn);
      listaColores.appendChild(li);
    });
  }

  function copiarHex(hex) {
    var mostrar = function () {
      pistaCopia.textContent = "Copiado: " + hex.toUpperCase();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(mostrar, function () {
        if (fallbackCopy(hex)) mostrar();
      });
    } else if (fallbackCopy(hex)) {
      mostrar();
    }
  }

  function fallbackCopy(hex) {
    var ta = document.createElement("textarea");
    ta.value = hex;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch (e) {
      document.body.removeChild(ta);
      return false;
    }
  }

  function procesarBlob(blob) {
    if (!blob || !blob.type || blob.type.indexOf("image/") !== 0) {
      mostrarAviso("El archivo no es una imagen reconocible.");
      return;
    }
    if (blobUrlActiva) {
      URL.revokeObjectURL(blobUrlActiva);
      blobUrlActiva = null;
    }
    var url = URL.createObjectURL(blob);
    blobUrlActiva = url;
    var img = new Image();
    function liberarSiEsActual() {
      if (blobUrlActiva === url) {
        URL.revokeObjectURL(url);
        blobUrlActiva = null;
      }
    }
    img.onload = function () {
      imgVista.onload = function () {
        liberarSiEsActual();
        imgVista.onload = null;
      };
      imgVista.onerror = function () {
        liberarSiEsActual();
        imgVista.onerror = null;
      };
      imgVista.src = url;
      imgVista.alt = "Imagen cargada para extraer paleta";
      seccionVista.hidden = false;
      var cols = extraerPaleta(img, 8);
      if (!cols.length) {
        mostrarAviso("No se pudieron leer los píxeles de la imagen (puede estar bloqueada por el navegador).");
        seccionPaletas.hidden = true;
        return;
      }
      renderPaleta(cols);
      seccionPaletas.hidden = false;
      pistaCopia.textContent = "Pulsa un color para copiar su código hexadecimal.";
      mostrarAviso("Paleta lista.", true);
    };
    img.onerror = function () {
      liberarSiEsActual();
      mostrarAviso("No se pudo abrir la imagen.");
    };
    img.src = url;
  }

  function alArchivo(file) {
    if (!file) return;
    procesarBlob(file);
  }

  btnArchivo.addEventListener("click", function () {
    inputArchivo.click();
  });

  inputArchivo.addEventListener("change", function () {
    alArchivo(inputArchivo.files && inputArchivo.files[0]);
    inputArchivo.value = "";
  });

  zona.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    zona.classList.add("arrastrando");
  });

  zona.addEventListener("dragleave", function (e) {
    e.preventDefault();
    zona.classList.remove("arrastrando");
  });

  zona.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    zona.classList.remove("arrastrando");
    var f = e.dataTransfer.files && e.dataTransfer.files[0];
    alArchivo(f);
  });

  document.addEventListener("paste", function (e) {
    var items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    var found = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.type.indexOf("image/") === 0) {
        var blob = it.getAsFile();
        if (blob) {
          e.preventDefault();
          procesarBlob(blob);
          found = true;
          break;
        }
      }
    }
    if (!found) {
      for (i = 0; i < items.length; i++) {
        it = items[i];
        if (it.kind === "file") {
          var f = it.getAsFile();
          if (f && f.type.indexOf("image/") === 0) {
            e.preventDefault();
            procesarBlob(f);
            break;
          }
        }
      }
    }
  });

  btnOtra.addEventListener("click", function () {
    if (blobUrlActiva) {
      URL.revokeObjectURL(blobUrlActiva);
      blobUrlActiva = null;
    }
    imgVista.removeAttribute("src");
    seccionVista.hidden = true;
    seccionPaletas.hidden = true;
    mostrarAviso("");
    inputArchivo.click();
  });

  zona.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputArchivo.click();
    }
  });
})();
