import { intArg, queryField } from "@nexus/schema";

export const getPostSubProduct = queryField("getPostSubProduct", {
  type: "SubProductList",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let products = [],
        lang,
        order = 1;

      if (!lang) lang = "VI";

      let subProductResult = await ctx.prisma.post.findOne({
        where: { id },
        select: {
          products: {
            select: {
              id: true,
              price: true,
              externalLink: { select: { url: true, order: true } },
              names: { where: { lang }, select: { word: true } },
            },
          },
        },
      });

      if (!subProductResult) return null;

      let mainProduct = await ctx.prisma.post.findOne({
        where: { id },
        select: { mainProductId: true },
      });

      if (!mainProduct) return null;

      for (const subProduct of subProductResult.products) {
        if (subProduct.id !== mainProduct.mainProductId) {
          products.push({
            productId: subProduct.id,
            productName: subProduct.names[0].word,
            price: subProduct.price,
            link: subProduct.externalLink ? subProduct.externalLink.url : "",
            order,
          });
          order++;
        }
      }

      return products ? products : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
