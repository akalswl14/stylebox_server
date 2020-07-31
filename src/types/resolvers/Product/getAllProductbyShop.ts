import { intArg, queryField } from "@nexus/schema";

export const getAllProductbyShop = queryField("getAllProductbyShop", {
  type: "Product",
  args: {
    shopId: intArg({ required: true }),
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopId, id } = args;
      let products;
      try {
        if (id) {
          products = await ctx.prisma.product.findMany({
            where: { shopId },
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          products = await ctx.prisma.product.findMany({
            where: { shopId },
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
        return products;
      } catch (e) {
        console.log(e);
      }
      if (products) {
        return products;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
