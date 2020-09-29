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
        productIdAsc,
        productNameAsc,
        priceAsc,
      } = args;

      let products = [],
        lang = 'VI';

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);

      let orderByOption = {},
        whereOption = {},
        nameOrderByOption = {};

      if (productId) {
        whereOption = { id: { contains: { productId } } };
      }
      if (productName) {
        whereOption = { names: { some: { word: { contains: productName } } } };
      }
      if (typeof productIdAsc === 'boolean') {
        orderByOption = productIdAsc ? { id: 'asc' } : { id: 'desc' };
      } else if (typeof productNameAsc === 'boolean') {
        nameOrderByOption = productNameAsc ? { word: 'asc' } : { word: 'desc' };
      } else if (typeof priceAsc === 'boolean') {
        orderByOption = priceAsc ? { price: 'asc' } : { price: 'desc' };
      } else {
        orderByOption = [{ id: 'asc' }, { price: 'asc' }];
        nameOrderByOption = { word: 'asc' };
      }

      let productResult = await ctx.prisma.product.findMany({
        where: whereOption,
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
        select: {
          id: true,
          names: {
            where: { lang },
            select: { word: true },
            orderBy: nameOrderByOption,
          },
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

      return products;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
