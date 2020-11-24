import { queryField, intArg, stringArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getSimilarPosts = queryField("getSimilarPosts", {
  type: "PostList",
  args: {
    lang: stringArg({ nullable: true }),
    TagIds: intArg({ list: true, nullable: true }),
    postId: intArg({ required: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }

      const { TagIds } = args;

      let tagIds: number[] = [];

      let { lang, cursorId, postId } = args;
      let similarPostPrismaResult,
        posts = [],
        isLikePost,
        settingQueryResult,
        loadingPostNum,
        totalPostNum,
        mainProductName,
        filterArrayOne: any[] = [],
        filterArrayTwo: any[] = [],
        skipNum,
        cursorOption,
        result1,
        result2,
        result3;

      if (!lang) lang = "VI";

      if (TagIds) {
        for (const tagId of TagIds) {
          if (tagId) tagIds.push(tagId);
        }
      } else {
        return null;
      }

      let productClassTagId = await ctx.prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          category: "ProductClass",
        },
        select: {
          id: true,
        },
      });

      let LocationTagId = await ctx.prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          category: "Location",
        },
        select: {
          id: true,
        },
      });

      let styleTagId = await ctx.prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          category: "Style",
        },
        select: {
          id: true,
        },
      });

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (
        LocationTagId.length > 0 &&
        productClassTagId.length > 0 &&
        styleTagId.length > 0
      ) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: LocationTagId, category: "Location" } },
          },
          select: { id: true },
        });

        result2 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: productClassTagId, category: "ProductClass" } },
          },
          select: { id: true },
        });

        for (const one of result1) {
          result2.filter((item) =>
            item.id === one.id ? filterArrayOne.push(item) : true
          );
        }

        result3 = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: styleTagId, category: "Style" } } },
          select: { id: true },
        });

        for (const one of result3) {
          filterArrayOne.filter((item) =>
            item.id === one.id ? filterArrayTwo.push(item) : true
          );
        }
      } else if (LocationTagId.length > 0 && productClassTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: LocationTagId, category: "Location" } },
          },
          select: { id: true },
        });
        result2 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: productClassTagId, category: "ProductClass" } },
          },
          select: { id: true },
        });
        for (const one of result1) {
          result2.filter((item) =>
            item.id === one.id ? filterArrayOne.push(item) : true
          );
        }
        filterArrayTwo = filterArrayOne;
      } else if (LocationTagId.length > 0 && styleTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: LocationTagId, category: "Location" } },
          },
          select: { id: true },
        });
        result2 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: styleTagId, category: "Style" } },
          },
          select: { id: true },
        });
        for (const one of result1) {
          result2.filter((item) =>
            item.id === one.id ? filterArrayOne.push(item) : true
          );
        }
        filterArrayTwo = filterArrayOne;
      } else if (productClassTagId.length > 0 && styleTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: styleTagId, category: "Style" } },
          },
          select: { id: true },
        });
        result2 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: productClassTagId, category: "ProductClass" } },
          },
          select: { id: true },
        });
        for (const one of result1) {
          result2.filter((item) =>
            item.id === one.id ? filterArrayOne.push(item) : true
          );
        }
        filterArrayTwo = filterArrayOne;
      } else if (LocationTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: LocationTagId, category: "Location" } },
          },
          select: { id: true },
        });
        filterArrayTwo = result1;
      } else if (productClassTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: {
            tags: { some: { OR: productClassTagId, category: "ProductClass" } },
          },
          select: { id: true },
        });
        filterArrayTwo = result1;
      } else if (styleTagId.length > 0) {
        result1 = await ctx.prisma.post.findMany({
          where: { tags: { some: { OR: styleTagId, category: "Style" } } },
          select: { id: true },
        });
        filterArrayTwo = result1;
      }

      let similarArr: { id: number }[] = [];

      for (const eachItem of filterArrayTwo) {
        if (eachItem.id !== postId) {
          similarArr.push(eachItem);
        }
      }

      if (!filterArrayTwo) return null;
      if (!similarArr) return null;

      if (cursorId) {
        skipNum = 1;
        cursorOption = { id: cursorId };
      }

      similarPostPrismaResult = await ctx.prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: loadingPostNum,
        skip: skipNum,
        cursor: cursorOption,
        where: {
          OR: similarArr,
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
        if (!item.mainProductId) return null;
        mainProductName = await ctx.prisma.product.findOne({
          where: { id: item.mainProductId },
          select: {
            names: { where: { lang }, select: { word: true } },
          },
        });

        if (!mainProductName) return null;

        isLikePost =
          (await ctx.prisma.like.count({
            where: { userId, postId: item.id },
          })) > 0
            ? true
            : false;

        posts.push({
          postId: item.id,
          postImage: item.images.length > 0 ? item.images[0].url : "",
          shopName: item.Shop?.names[0].word,
          productName: mainProductName.names[0].word,
          price: item.mainProductPrice,
          isLikePost,
        });
      }

      totalPostNum = await ctx.prisma.post.count({
        where: {
          OR: similarArr,
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
