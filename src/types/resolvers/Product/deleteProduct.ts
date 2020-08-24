import { intArg, mutationField } from "@nexus/schema";

export const deleteProduct = mutationField("deleteProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  description: "id argument is for Product ID.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let product;
      try {
        product = await ctx.prisma.product.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      return product ? product : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
