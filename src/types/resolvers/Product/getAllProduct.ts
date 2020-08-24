import { intArg, queryField } from "@nexus/schema";

export const getAllProduct = queryField("getAllProduct", {
  type: "Product",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let products;
      try {
        if (id) {
          products = await ctx.prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          products = await ctx.prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
        return products;
      } catch (e) {
        console.log(e);
      }
      return products ? products : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
