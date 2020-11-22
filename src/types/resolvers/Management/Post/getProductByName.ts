import { intArg, queryField, stringArg } from "@nexus/schema";

export const getProductByName = queryField("getProductByName", {
  type: "GetSubProductInfo",
  args: {
    shopId: intArg({ nullable: true }),
    productName: stringArg({ required: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { productName, shopId } = args;
      let lang = "VI",
        searchResult = [];

      let branches = await ctx.prisma.branch.findMany({
        where: { shopId },
        select: {
          products: {
            where: { names: { some: { word: { contains: productName } } } },
            select: {
              id: true,
            },
          },
        },
      });

      if (!branches) return null;

      const IdList: number[] = [];
      for (const item of branches) {
        for (const eachItem of item.products) {
          IdList.push(eachItem.id);
        }
      }

      const setList = Array.from(new Set(IdList));

      let products = await ctx.prisma.product.findMany({
        where: { id: { in: setList } },
        orderBy: { id: "asc" },
        select: {
          id: true,
          price: true,
          externalLink: { select: { url: true } },
          names: { where: { lang }, select: { word: true } },
        },
      });

      if (!products) return null;

      for (const product of products) {
        searchResult.push({
          productId: product.id,
          productName: product.names[0].word,
          price: product.price,
          link: product.externalLink.url,
        });
      }

      return searchResult ? searchResult : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
