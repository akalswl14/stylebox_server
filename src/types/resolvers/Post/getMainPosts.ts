import { queryField, intArg, stringArg, arg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getMainPosts = queryField('getMainPosts', {
  type: 'priorityPostList',
  args: {
    lastPostPriority: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    locationTagId: intArg({ nullable: true }),
    postIds: arg({ type: 'idDicInputType', list: true, nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      const { locationTagId } = args;
      let { lang, postIds, lastPostPriority } = args;
      let settingQueryResult,
        loadingPostNum,
        TodaysStylesPeriod,
        mainPostQuery,
        returnPosts = [],
        isLikePost,
        productName,
        saveList = [],
        mainPostQueryNext,
        loadingDifferentPostNum,
        idx = [];

      if (!lang) lang = 'ENG';
      if (!postIds) postIds = [];
      if (!lastPostPriority) lastPostPriority = 5;
      if (lastPostPriority === 0) return null;

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, TodaysStylesPeriod: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      TodaysStylesPeriod = settingQueryResult
        ? settingQueryResult.TodaysStylesPeriod
        : 30;

      let today = new Date();
      let standardDate = new Date(today - 3600000 * 24 * TodaysStylesPeriod);

      mainPostQuery = await ctx.prisma.post.findMany({
        where: {
          priority: lastPostPriority,
          createdAt: { gte: standardDate },
          OR: [
            { priority: lastPostPriority },
            { createdAt: { gte: standardDate } },
            { tags: { some: { id: locationTagId } } },
          ],
        },
        select: {
          priority: true,
          preferrers: { select: { userId: true } },
          mainProductPrice: true,
          id: true,
          images: { select: { url: true } },
          mainProductId: true,
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          products: {
            select: {
              mainPostId: true,
              names: { where: { lang }, select: { word: true } },
            },
          },
          tags: {
            where: { category: 'Location' },
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      });

      if (!mainPostQuery) return null;

      loadingDifferentPostNum = mainPostQuery.length - postIds.length;

      if (mainPostQuery.length - postIds.length < loadingPostNum) {
        for (const eachItem of mainPostQuery) {
          for (const eachId of postIds) {
            if (eachId != eachItem.id) {
              saveList.push(eachItem);
            }
          }
        }

        if (lastPostPriority - 1 === 0) return null;
        lastPostPriority--;

        mainPostQueryNext = await ctx.prisma.post.findMany({
          where: {
            priority: lastPostPriority,
            createdAt: { gte: standardDate },
            OR: [
              { priority: lastPostPriority },
              { createdAt: { gte: standardDate } },
              { tags: { some: { id: locationTagId } } },
            ],
          },
          select: {
            priority: true,
            preferrers: { select: { userId: true } },
            mainProductPrice: true,
            id: true,
            images: { select: { url: true } },
            mainProductId: true,
            Shop: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
            products: {
              select: {
                mainPostId: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
            tags: {
              where: { category: 'Location' },
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });

        if (!mainPostQueryNext) return null;

        idx = [];

        while (idx.length <= loadingDifferentPostNum) {
          let n =
            Math.floor(Math.random() * (mainPostQueryNext.length - 1)) + 0;
          if (idx.indexOf(n) < 0) {
            if (mainPostQueryNext[n].id !== postIds) {
              idx.push(n);
              saveList.push(mainPostQueryNext[n]);
            }
          }
        }
      } else {
        while (idx.length <= loadingPostNum) {
          let n = Math.floor(Math.random() * (mainPostQuery.length - 1)) + 0;
          if (idx.indexOf(n) < 0) {
            if (mainPostQuery[n].id !== postIds) {
              idx.push(n);
              saveList.push(mainPostQuery[n]);
            }
          }
        }
      }

      for (const eachItem of saveList) {
        productName = eachItem.products.filter(
          (product) => product.mainPostId === eachItem.id
        );

        isLikePost = eachItem.preferrers.filter(
          (preferrer) => preferrer.userId === userId
        )
          ? true
          : false;

        returnPosts.push({
          postId: eachItem.id,
          shopName: eachItem.Shop?.names[0].word,
          price: eachItem.mainProductPrice,
          postImage: eachItem.images[0].url,
          locationTagName: eachItem.tags[0].names[0].word,
          isLikePost,
          productName,
        });
      }

      let rtn = {
        lastPostPriority,
        returnPosts,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
