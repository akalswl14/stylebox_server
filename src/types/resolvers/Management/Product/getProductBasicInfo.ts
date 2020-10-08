import { intArg, queryField } from "@nexus/schema";

export const getProductBasicInfo = queryField("getProductBasicInfo", {
  type: "ProductBasicInfo",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.product.findOne({
        where: { id },
        select: {
          names: { where: { lang: "VI" }, select: { word: true } },
          price: true,
          images: { select: { url: true } },
          externalLink: { select: { url: true } },
        },
      });
      if (!queryResult) return null;
      return {
        productId: id,
        productName: queryResult.names[0].word,
        price: queryResult.price,
        productImage: queryResult.images[0].url,
        externalLink: queryResult.externalLink.url,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
