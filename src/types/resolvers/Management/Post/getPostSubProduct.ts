import { intArg, queryField } from '@nexus/schema';

export const getPostSubProduct = queryField('getPostSubProduct', {
  type: 'SubProductList',
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let products = [],
        lang;

      if (!lang) lang = 'VI';

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

      for (const subProduct of subProductResult?.products) {
        products.push({
          productId: subProduct.id,
          productName: subProduct.names[0].word,
          price: subProduct.price,
          link: subProduct.externalLink.url,
          order: subProduct.externalLink.order,
        });
      }

      return products;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
