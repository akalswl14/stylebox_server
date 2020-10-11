import { queryField, intArg, stringArg, arg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getSimilarPosts = queryField('getSimilarPosts', {
  type: 'PostList',
  args: {
    LocationTagId: arg({ type: 'idDicInputType', list: true, required: true }),
    lang: stringArg({ nullable: true }),
    productClassTagId: arg({
      type: 'idDicInputType',
      list: true,
      required: true,
    }),
    styleTagId: arg({ type: 'idDicInputType', list: true, required: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      const { productClassTagId, styleTagId, LocationTagId } = args;
      let { lang, cursorId } = args;
      let similarPostPrismaResult,
        posts = [],
        isLikePost,
        settingQueryResult,
        loadingPostNum,
        totalPostNum,
        mainProductName,
        filterArrayOne = [],
        filterArrayTwo = [],
        skipNum,
        cursorOption;

      if (!lang) lang = 'VI';

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      let result1 = await ctx.prisma.post.findMany({
        where: {
          tags: { some: { OR: LocationTagId, category: 'Location' } },
        },
        select: { id: true },
      });

      let result2 = await ctx.prisma.post.findMany({
        where: {
          tags: { some: { OR: productClassTagId, category: 'ProductClass' } },
        },
        select: { id: true },
      });

      for (const one of result1) {
        result2.filter((item) =>
          item.id === one.id ? filterArrayOne.push(item) : true
        );
      }

      let result3 = await ctx.prisma.post.findMany({
        where: { tags: { some: { OR: styleTagId, category: 'Style' } } },
        select: { id: true },
      });

      for (const one of result3) {
        filterArrayOne.filter((item) =>
          item.id === one.id ? filterArrayTwo.push(item) : true
        );
      }

      if (!filterArrayTwo) return { totalPostNum: 0, posts: [] };

      if (cursorId) {
        skipNum = 1;
        cursorOption = { id: cursorId };
      }

      similarPostPrismaResult = await ctx.prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: loadingPostNum,
        skip: skipNum,
        cursor: cursorOption,
        where: {
          OR: filterArrayTwo,
        },
        select: {
          mainProductPrice: true,
          id: true,
          images: { select: { url: true } },
          mainProductId: true,
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      });

      if (!similarPostPrismaResult) return null;

      for (const item of similarPostPrismaResult) {
        mainProductName = await ctx.prisma.product.findOne({
          where: { id: item.mainProductId },
          select: {
            names: { where: { lang }, select: { word: true } },
          },
        });

        isLikePost =
          (await ctx.prisma.like.count({
            where: { userId, postId: item.id },
          })) > 0
            ? true
            : false;

        posts.push({
          postId: item.id,
          postImage: item.images[0].url,
          shopName: item.Shop?.names[0].word,
          productName: mainProductName.names[0].word,
          price: item.mainProductPrice,
          isLikePost,
        });
      }

      totalPostNum = await ctx.prisma.post.count({
        where: {
          OR: filterArrayTwo,
        },
      });

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
