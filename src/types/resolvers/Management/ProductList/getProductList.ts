import { booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const getProductList = queryField('getProductList', {
  type: 'ProductList',
  args: {
    pageNum: intArg({ nullable: true }),
    productId: intArg({ nullable: true }),
    productName: stringArg({ nullable: true }),
    productIdAsc: booleanArg({ nullable: true }),
    productNameAsc: booleanArg({ nullable: true }),
    priceAsc: booleanArg({ nullable: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        productId,
        productName,
        productIdAsc = true,
        productNameAsc = true,
        priceAsc = true,
      } = args;

      let products = [],
        rtn = [],
        lang;

      if (!lang) lang = 'VI';

      let queryOption = {
        where: {},
        orderBy: {},
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          price: true,
          externalLink: { select: { url: true } },
        },
      };

      if (productId) queryOption.where.id = productId;
      if (productName) queryOption.where.names.some.word = productName;
      if (!productIdAsc) queryOption.orderBy.id = 'desc';
      if (!productNameAsc) queryOption.select.names.orderBy.word = 'desc';
      if (!priceAsc) queryOption.orderBy.price = 'desc';

      let productResult = await ctx.prisma.product.findMany(queryOption);

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

      let Num = 13;
      for (let i = pageNum * Num - Num; i < pageNum * Num; i++) {
        rtn.push(products[i]);
      }

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
