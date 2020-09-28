import { booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const getPostList = queryField('getPostList', {
  type: 'PostManagementList',
  args: {
    pageNum: intArg({ nullable: true }),
    postId: intArg({ nullable: true }),
    mainProductName: stringArg({ nullable: true }),
    shopName: stringArg({ nullable: true }),
    postIdAsc: booleanArg({ nullable: true }),
    mainProductNameAsc: booleanArg({ nullable: true }),
    priceAsc: booleanArg({ nullable: true }),
    shopNameAsc: booleanArg({ nullable: true }),
    priorityAsc: booleanArg({ nullable: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        postId,
        mainProductName,
        shopName,
        postIdAsc = true,
        mainProductNameAsc = true,
        priceAsc = true,
        shopNameAsc = true,
        priorityAsc = true,
      } = args;

      let posts = [],
        rtn = [],
        lang;

      if (!lang) lang = 'VI';

      let queryOption = {
        where: {},
        orderBy: {},
        select: {
          id: true,
          mainProductPrice: true,
          weeklyRankNum: true,
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          mainProductId: true,
          priority: true,
          externalLinkClickNum: true,
          postExternalLinks: true,
          products: true,
        },
      };

      if (postId) queryOption.where.id = postId;
      if (mainProductName) {
        let mainProductId = await ctx.prisma.product.findMany({
          where: { names: { some: { word: mainProductName } } },
          select: { id: true },
        });

        queryOption.where.mainProductId = mainProductId[0].id;
      }
      if (shopName) queryOption.where.Shop.names.some.word = shopName;
      if (!postIdAsc) queryOption.orderBy.id = 'desc';
      //   if (!mainProductNameAsc);
      if (!priceAsc) queryOption.orderBy.mainProductPrice = 'desc';
      if (!shopNameAsc)
        queryOption.select.Shop.select.names.orderBy.word = 'desc';
      if (!priorityAsc) queryOption.orderBy.priority = 'desc';

      let postResult = await ctx.prisma.post.findMany(queryOption);

      for (const post of postResult) {
        let productName = await ctx.prisma.product.findOne({
          where: { id: post.mainProductId },
          select: {
            names: { where: { lang }, select: { word: true } },
          },
        });

        let likesNum = await ctx.prisma.like.count({
          where: { postId: post.id },
        });
        let viewsNum = await ctx.prisma.view.count({
          where: { postId: post.id },
        });

        posts.push({
          postId: post.id,
          mainProductName: productName?.names[0].word,
          price: post.mainProductPrice,
          shopName: post.Shop?.names[0].word,
          priority: post.priority,
          likesNum,
          subProductsNum: post.products.length - 1,
          viewsNum,
          linksClickNum: post.externalLinkClickNum,
          linksNum: post.postExternalLinks.length,
          rank: post.weeklyRankNum,
        });
      }

      let Num = 13;

      for (let i = pageNum * Num - Num; i < pageNum * Num; i++) {
        rtn.push(posts[i]);
      }

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
