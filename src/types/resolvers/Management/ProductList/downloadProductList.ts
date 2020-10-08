import { queryField } from '@nexus/schema';

export const downloadProductList = queryField('downloadProductList', {
  type: 'ProductList',
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let products = [],
        lang;

      if (!lang) lang = 'VI';

      let productResult = await ctx.prisma.product.findMany({
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          price: true,
          externalLink: { select: { url: true } },
        },
      });

      for (const product of productResult) {
        let postNum = await ctx.prisma.post.count({
          where: { products: { some: { id: product.id } } },
        });

        products.push({
          productId: product.id,
          productName: product.names[0].word,
          price: product.price,
          postNum,
          link: product.externalLink.url,
        });
      }

      return products ? products : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
