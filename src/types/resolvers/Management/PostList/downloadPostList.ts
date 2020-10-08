import { queryField } from '@nexus/schema';

export const downloadPostList = queryField('downloadPostList', {
  type: 'PostManagementList',
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let posts = [],
        lang;

      if (!lang) lang = 'VI';

      let postResult = await ctx.prisma.post.findMany({
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
      });

      if (!postResult) return null;

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

      return posts ? posts : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
