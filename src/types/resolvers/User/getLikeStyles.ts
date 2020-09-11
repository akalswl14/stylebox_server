import { queryField, stringArg, intArg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getLikeStyles = queryField('getLikeStyles', {
  type: 'PostList',
  args: {
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { cursorId } = args;
      let { lang } = args;
      let QueryResult,
        totalPostNum,
        mainProduct,
        locationTag,
        posts = [],
        settingQueryResult,
        loadingPostNum;

      const userId = Number(getUserId(ctx));

      if (!lang) lang = 'ENG';

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (!cursorId) {
        QueryResult = await ctx.prisma.post.findMany({
          take: loadingPostNum,
          where: { preferrers: { some: { userId } } },
          select: {
            id: true,
            images: { select: { url: true } },
            Shop: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
            mainProductPrice: true,
            mainProductId: true,
            products: {
              select: {
                mainPostId: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
            tags: {
              select: {
                names: { where: { lang }, select: { word: true } },
                category: true,
              },
            },
          },
        });
      } else {
        QueryResult = await ctx.prisma.post.findMany({
          take: loadingPostNum,
          skip: 1,
          cursor: { id: cursorId },
          where: { preferrers: { some: { userId } } },
          select: {
            id: true,
            images: { select: { url: true } },
            Shop: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
            mainProductPrice: true,
            mainProductId: true,
            products: {
              select: {
                mainPostId: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
            tags: {
              select: {
                names: { where: { lang }, select: { word: true } },
                category: true,
              },
            },
          },
        });
      }

      if (!QueryResult) return null;

      totalPostNum = await ctx.prisma.post.count({
        where: { preferrers: { some: { userId } } },
      });

      if (!totalPostNum) totalPostNum = 0;

      for (const eachLike of QueryResult) {
        mainProduct = await ctx.prisma.product.findOne({
          where: { id: eachLike.mainProductId },
          select: {
            names: { where: { lang }, select: { word: true } },
          },
        });

        locationTag = eachLike.tags.filter(
          (tag) => tag.category === 'Location'
        );

        posts.push({
          postId: eachLike.id,
          productName: mainProduct.names[0].word,
          shopName: eachLike.Shop?.names[0].word,
          postImage: eachLike.images[0].url,
          price: eachLike.mainProductPrice,
          locationTagName: locationTag[0].names[0].word,
        });
      }

      let rtn = {
        totalPostNum,
        posts,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
