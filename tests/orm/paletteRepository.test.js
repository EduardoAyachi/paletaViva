import { createRequire } from "node:module";
import { describe, expect, it, vi } from "vitest";

const require = createRequire(import.meta.url);
const { createPaletteRepository } = require("../../orm/paletteRepository.js");

describe("paletteRepository", () => {
  it("crea una paleta con colores relacionados", async () => {
    const created = {
      id: 1,
      name: "Demo",
      source: "manual",
      colors: []
    };
    const prisma = {
      palette: {
        create: vi.fn().mockResolvedValue(created)
      }
    };
    const repo = createPaletteRepository(prisma);

    await expect(
      repo.createPalette({
        name: "Demo",
        source: "manual",
        colors: [
          { hex: "#FF0000", r: 255, g: 0, b: 0 },
          { hex: "#00FF00", r: 0, g: 255, b: 0, position: 3 }
        ]
      })
    ).resolves.toBe(created);

    expect(prisma.palette.create).toHaveBeenCalledWith({
      data: {
        name: "Demo",
        source: "manual",
        colors: {
          create: [
            { hex: "#FF0000", r: 255, g: 0, b: 0, position: 0 },
            { hex: "#00FF00", r: 0, g: 255, b: 0, position: 3 }
          ]
        }
      },
      include: {
        colors: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });
  });

  it("busca una paleta por id con colores ordenados", async () => {
    const prisma = {
      palette: {
        findUnique: vi.fn().mockResolvedValue(null)
      }
    };
    const repo = createPaletteRepository(prisma);

    await repo.findPaletteById(8);

    expect(prisma.palette.findUnique).toHaveBeenCalledWith({
      where: {
        id: 8
      },
      include: {
        colors: {
          orderBy: {
            position: "asc"
          }
        }
      }
    });
  });
});
