import { queryField, stringArg } from '@nexus/schema';

export const getProductByName = queryField('getProductByName', {
  type: 'SubProductList',
  args: {
    productName: stringArg({ required: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { productName } = args;
      let lang = 'VI',
        searchResult = [];
      let products = await ctx.prisma.product.findMany({
        where: { names: { some: { word: { contains: productName } } } },
        select: {
          id: true,
          price: true,
          externalLink: { select: { url: true } },
          names: { where: { lang }, select: { word: true } },
        },
      });

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
