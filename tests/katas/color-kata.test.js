import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const kata = require("../../katas/color-kata.js");

describe("kata de colores con TDD", () => {
  it("normaliza colores hexadecimales largos", () => {
    expect(kata.normalizarHex(" aa33cc ")).toBe("#AA33CC");
  });

  it("expande colores hexadecimales cortos", () => {
    expect(kata.normalizarHex("#0fc")).toBe("#00FFCC");
  });

  it("rechaza colores invalidos", () => {
    expect(() => kata.normalizarHex("#12xz89")).toThrow("Color hexadecimal invalido");
  });

  it("convierte hexadecimal a RGB", () => {
    expect(kata.rgbDesdeHex("#336699")).toEqual({ r: 51, g: 102, b: 153 });
  });

  it("elige texto oscuro o claro segun contraste simple", () => {
    expect(kata.textoContraste("#FFFFFF")).toBe("#000000");
    expect(kata.textoContraste("#111111")).toBe("#FFFFFF");
  });
});
