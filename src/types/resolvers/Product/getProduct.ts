import { intArg, queryField } from "@nexus/schema";

export const getProduct = queryField("getProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let product;
      try {
        if (id) {
          product = await ctx.prisma.product.findOne({
            where: { id },
          });
        }
      } catch (e) {
        console.log(e);
      }
      if (product) {
        return product;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
