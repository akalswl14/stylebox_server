import { intArg, queryField, arg } from "@nexus/schema";

export const getAllProductbyTag = queryField("getAllProductbyTag", {
  type: "Product",
  args: {
    tags: arg({ type: "idDicInputType", list: true, required: true }),
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id } = args;
      let products;
      if (id) {
        products = await ctx.prisma.product.findMany({
          where: { tags: { some: { OR: tags } } },
          orderBy: { createdAt: "desc" },
          take: take,
          cursor: { id },
          skip: skip,
        });
      } else {
        products = await ctx.prisma.product.findMany({
          where: { tags: { some: { OR: tags } } },
          orderBy: { createdAt: "desc" },
          take: take,
        });
      }
      return products;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
