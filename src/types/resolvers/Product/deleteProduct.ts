import { intArg, mutationField } from "@nexus/schema";

export const deleteProduct = mutationField("deleteProduct", {
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
        product = await ctx.prisma.product.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      console.log(product);
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
