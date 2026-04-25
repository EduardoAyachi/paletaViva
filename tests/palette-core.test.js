import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const core = require("../palette-core.js");

describe("palette-core", () => {
  it("calcula la distancia cuadratica entre dos colores", () => {
    expect(core.distanciaColor(10, 20, 30, 13, 24, 42)).toBe(169);
  });

  it("convierte RGB a hexadecimal con ceros a la izquierda", () => {
    expect(core.hexDeRgb(0, 15, 255)).toBe("#000fff");
  });

  it("cuantiza un color por bloques", () => {
    expect(core.cuantizar(23, 24, 49, 24)).toBe("0,24,48");
  });

  it("elige el nombre aproximado mas cercano", () => {
    expect(core.nombreAproximado(235, 45, 40)).toBe("~Rojo");
  });

  it("extrae una paleta ordenada por frecuencia e ignora pixeles transparentes", () => {
    const pixeles = new Uint8ClampedArray([
      250, 0, 0, 255,
      245, 10, 5, 255,
      0, 0, 240, 255,
      0, 255, 0, 40
    ]);

    expect(core.extraerPaletaDesdePixeles(pixeles, 2)).toEqual([
      { r: 248, g: 5, b: 3, cuenta: 2 },
      { r: 0, g: 0, b: 240, cuenta: 1 }
    ]);
  });
});
