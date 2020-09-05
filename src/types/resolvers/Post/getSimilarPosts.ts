import { queryField, intArg, stringArg, arg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getSimilarPosts = queryField('getSimilarPosts', {
  type: 'PostList',
  args: {
    LocationTagId: intArg({ nullable: true }),
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
        productName,
        isLikeBoolean,
        settingQueryResult,
        loadingPostNum,
        lastPostInResults,
        postTotalNum;

      if (!lang) lang = 'ENG';

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (!cursorId) {
        similarPostPrismaResult = await ctx.prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          take: loadingPostNum,
          where: {
            tags: { every: { names: { every: { lang } } } },
            AND: {
              tags: {
                every: {
                  names: {
                    some: {
                      OR: [
                        { id: LocationTagId },
                        { id: productClassTagId },
                        { id: styleTagId },
                      ],
                    },
                  },
                },
              },
            },
          },
          select: {
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
          },
        });
      } else {
        similarPostPrismaResult = await ctx.prisma.post.findMany({
          orderBy: { createdAt: 'desc' },
          take: loadingPostNum,
          skip: 1,
          cursor: { id: cursorId },
          where: {
            tags: { every: { names: { every: { lang } } } },
            AND: {
              tags: {
                every: {
                  names: {
                    some: {
                      OR: [
                        { id: LocationTagId },
                        { id: productClassTagId },
                        { id: styleTagId },
                      ],
                    },
                  },
                },
              },
            },
          },
          select: {
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
          },
        });
      }

      if (!similarPostPrismaResult) return null;

      lastPostInResults = similarPostPrismaResult[loadingPostNum - 1];
      cursorId = lastPostInResults.id;

      for (const item of similarPostPrismaResult) {
        productName = item.products.filter(
          (product) => product.mainPostId === item.id
        )[0].names;

        isLikeBoolean = item.preferrers.filter(
          (preferrer) => preferrer.userId === userId
        )
          ? true
          : false;

        posts.push({
          postId: item.id,
          postImage: item.images[0].url,
          shopName: item.Shop?.names[0].word,
          productName,
          price: item.mainProductPrice,
          isLikeBoolean,
        });
      }

      postTotalNum = await ctx.prisma.post.count({
        where: {
          tags: { every: { names: { every: { lang } } } },
          AND: {
            tags: {
              every: {
                names: {
                  some: {
                    OR: [
                      { id: LocationTagId },
                      { id: productClassTagId },
                      { id: styleTagId },
                    ],
                  },
                },
              },
            },
          },
        },
      });

      let rtn = {
        postTotalNum,
        posts,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
