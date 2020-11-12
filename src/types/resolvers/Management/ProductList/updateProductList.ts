import { arg, mutationField } from "@nexus/schema";

export const updateProductList = mutationField("updateProductList", {
  type: "Boolean",
  args: {
    products: arg({ type: "ProductListInputType", list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { products = [] } = args;
      let updateQuery;

      for (const product of products) {
        if (product) {
          updateQuery = await ctx.prisma.product.update({
            where: { id: product.id },
            data: { price: product.price },
          });
        }
      }

      if (!updateQuery) return false;

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
