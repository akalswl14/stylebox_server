import { queryField, stringArg, intArg, arg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getSearchResult = queryField("getSearchResult", {
  type: "searchResultList",
  args: {
    tags: arg({ type: "TagClassIdInputType", required: true }),
    filter: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    lastPostDate: arg({ type: "DateTime", nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  description:
    "About filter, 1 means Recent, 2 means Price Low and 3 means Price High",
  resolve: async (_, args, ctx) => {
    try {
      const { tags, filter = 1, lang = "ENG", lastPostDate, cursorId } = args;
      let queryResult,
        TagResult = [],
        PostResult = [],
        ClassResult,
        orderQuery,
        queryArg,
        loadingPostNum,
        totalPostNum,
        SearchPeriod,
        rtnLastPostDate,
        classIds = [],
        whereOption,
        queryOption,
        recentQueryOption,
        cursorOption,
        tagIds = [],
        posts = [];
      const userId = Number(getUserId(ctx));
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, SearchPeriod: true },
      });
      loadingPostNum = queryResult ? queryResult.loadingPostNum : 20;
      SearchPeriod = queryResult ? queryResult.SearchPeriod : 30;
      const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let queryDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let searchDate = new Date();
      searchDate.setUTCDate(today.getUTCDate() - SearchPeriod);
      searchDate.setUTCHours(0, 0, 0, 0);
      for (const eachTag of tags) {
        if (eachTag.isClass && eachTag.classId) {
          ClassResult = await ctx.prisma.class.findOne({
            where: { id: eachTag.classId },
            select: { tags: { select: { id: true } } },
          });
          if (ClassResult) {
            let classTags = ClassResult.tags;
            tagIds.push(...classTags);
          }
        } else {
          tagIds.push({ id: eachTag.tagId });
        }
      }
      queryOption = {
        take: loadingPostNum,
        select: {
          id: true,
          tags: {
            where: { category: "Location" },
            select: { names: { where: { lang }, select: { word: true } } },
          },
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          products: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          mainProductPrice: true,
          mainProductId: true,
          images: { select: { url: true }, take: 1 },
          createdAt: true,
        },
      };
      if (filter == 1) {
        queryOption.orderBy = { priority: "desc" };
        recentQueryOption = queryOption;
        if (cursorId && lastPostDate) {
          queryDate.setTime(lastPostDate);
          queryDate.setUTCHours(0, 0, 0, 0);
          recentQueryOption.where = {
            tags: { some: { AND: tagIds } },
            createdAt: queryDate,
          };
          recentQueryOption.cursor = { id: cursorId };
          recentQueryOption.skip = 1;
        } else {
          recentQueryOption.where = {
            tags: { some: { AND: tagIds } },
            createdAt: queryDate,
          };
        }
        while (
          PostResult.length < loadingPostNum &&
          queryDate.getTime() >= searchDate.getTime()
        ) {
          queryResult = await ctx.prisma.post.findMany(recentQueryOption);
          PostResult.push(...queryResult);
          recentQueryOption = queryOption;
          if (queryResult.length > 0) {
            recentQueryOption.where = {
              tags: { some: { AND: tagIds } },
              createdAt: queryDate,
            };
            recentQueryOption.cursor = {
              id: queryResult[queryResult.length - 1].id,
            };
            recentQueryOption.skip = 1;
          } else {
            queryDate.setUTCDate(queryDate.getUTCDate() - 1);
            recentQueryOption.where = {
              tags: { some: { AND: tagIds } },
              createdAt: queryDate,
            };
          }
        }
      } else {
        if (filter == 2) {
          queryOption.where = {
            tags: { some: { AND: tagIds } },
            createdAt: { gte: searchDate },
          };
          queryOption.orderBy = [
            { isOnline: "desc" },
            { mainProductPrice: "asc" },
          ];
        } else {
          queryOption.where = {
            tags: { some: { AND: tagIds } },
            createdAt: { gte: searchDate },
          };
          queryOption.orderBy = [
            { isOnline: "asc" },
            { mainProductPrice: "desc" },
          ];
        }
        if (cursorId) {
          queryOption.cursor = { id: cursorId };
          queryOption.skip = 1;
        }
        PostResult = await ctx.prisma.post.findMany(queryOption);
      }

      totalPostNum = await ctx.prisma.post.count({
        where: {
          tags: { some: { AND: tagIds } },
          createdAt: { gte: searchDate },
        },
      });
      rtnLastPostDate = PostResult[PostResult.length - 1].createdAt;
      queryResult = await ctx.prisma.tag.findMany({
        where: { OR: tagIds },
        select: { id: true, classId: true, category: true, isClass: true },
      });
      for (const eachTag of queryResult) {
        TagResult.push({
          tagId: eachTag.id,
          classId: eachTag.classId,
          category: eachTag.category,
          isClass: eachTag.isClass,
        });
      }
      for (const eachPost of PostResult) {
        queryResult = await ctx.prisma.like.count({
          where: { userId, postId: eachPost.id },
        });
        let isLikePost = queryResult > 0 ? true : false;
        queryResult = await ctx.prisma.productName.findMany({
          where: { productId: eachPost.mainProductId, lang },
          select: { word: true },
        });
        let productName = queryResult[0].word;
        posts.push({
          postId: eachPost.id,
          locationTagName: eachPost.tags[0].names[0].word,
          isLikePost,
          shopName: eachPost.Shop.names[0].word,
          productName,
          price: eachPost.mainProductPrice,
          postImage: eachPost.images[0].url,
        });
      }
      let rtn = {
        lastPostDate: rtnLastPostDate,
        totalPostNum,
        tags: TagResult,
        posts,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
