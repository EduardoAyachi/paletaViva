function crearClientePrisma() {
  var PrismaClient = require("@prisma/client").PrismaClient;
  return new PrismaClient();
}

function createPaletteRepository(prisma) {
  var client = prisma || crearClientePrisma();

  function mapColor(color, index) {
    return {
      hex: color.hex,
      r: color.r,
      g: color.g,
      b: color.b,
      position: typeof color.position === "number" ? color.position : index
    };
  }

  return {
    createPalette: function (input) {
      return client.palette.create({
        data: {
          name: input.name,
          source: input.source || null,
          colors: {
            create: input.colors.map(mapColor)
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
    },
    findPaletteById: function (id) {
      return client.palette.findUnique({
        where: {
          id: id
        },
        include: {
          colors: {
            orderBy: {
              position: "asc"
            }
          }
        }
      });
    },
    listPalettes: function () {
      return client.palette.findMany({
        orderBy: {
          createdAt: "desc"
        },
        include: {
          colors: {
            orderBy: {
              position: "asc"
            }
          }
        }
      });
    },
    deletePalette: function (id) {
      return client.palette.delete({
        where: {
          id: id
        }
      });
    },
    close: function () {
      if (client.$disconnect) {
        return client.$disconnect();
      }
      return Promise.resolve();
    }
  };
}

module.exports = {
  createPaletteRepository: createPaletteRepository
};
