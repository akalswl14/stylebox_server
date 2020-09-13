import { queryField, stringArg, intArg, arg } from "@nexus/schema";
import { Context } from "nexus-prisma/dist/utils";
import { getUserId } from "../../../utils";

export const getRecentSearchResult = queryField("getRecentSearchResult", {
  type: "searchResultList",
  args: {
    tags: arg({ type: "TagClassIdInputType", required: true, list: true }),
    lang: stringArg({ nullable: true }),
    lastPostDate: arg({ type: "DateTime", nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tags, lang = "ENG", lastPostDate, cursorId } = args;
      let queryResult,
        TagResult = [],
        PostResult = [],
        ClassResult,
        loadingPostNum,
        totalPostNum,
        SearchPeriod,
        inputLastDate,
        rtnLastPostDate,
        functionOption = {},
        classTags = [],
        tagIds = [],
        tagNumList = [],
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
      let queryDateTomorrow = new Date(new Date().setUTCHours(24, 0, 0, 0));
      let searchDate = new Date();
      searchDate.setUTCDate(today.getUTCDate() - SearchPeriod);
      searchDate.setUTCHours(0, 0, 0, 0);
      inputLastDate = Date.parse(lastPostDate);
      for (const eachTag of tags) {
        if (eachTag.isClass && eachTag.classId) {
          ClassResult = await ctx.prisma.class.findOne({
            where: { id: eachTag.classId },
            select: { tags: { select: { id: true } } },
          });
          if (ClassResult) {
            let tmpTags = ClassResult.tags;
            classTags.push(...tmpTags);
          }
        } else if (eachTag.tagId) {
          tagIds.push({ tags: { some: { id: eachTag.tagId } } });
          tagNumList.push(eachTag.tagId);
        }
      }
      for (const eachTag of classTags) {
        if (eachTag.id) {
          tagIds.push({ tags: { some: eachTag } });
          tagNumList.push(eachTag.id);
        }
      }
      if (cursorId && lastPostDate) {
        queryDate.setTime(inputLastDate);
        queryDate.setUTCHours(0, 0, 0, 0);
        queryDateTomorrow.setTime(queryDate);
        queryDateTomorrow.setUTCHours(24, 0, 0, 0);
        functionOption = { cursorId };
      }
      while (
        PostResult.length < loadingPostNum &&
        queryDate.getTime() >= searchDate.getTime()
      ) {
        queryResult = await getResult(
          ctx,
          loadingPostNum,
          lang,
          tagIds,
          queryDate,
          queryDateTomorrow,
          functionOption
        );
        PostResult.push(...queryResult);
        if (queryResult.length > 0) {
          functionOption = { cursorId: queryResult[queryResult.length - 1].id };
        } else {
          queryDate.setUTCDate(queryDate.getUTCDate() - 1);
          queryDateTomorrow.setTime(queryDate);
          queryDateTomorrow.setUTCHours(24, 0, 0, 0);
          functionOption = {};
        }
      }
      totalPostNum = await ctx.prisma.post.count({
        where: {
          AND: tagIds,
          createdAt: { gte: searchDate },
        },
      });
      if (PostResult.length > 0) {
        rtnLastPostDate = PostResult[PostResult.length - 1].createdAt;
        queryResult = await ctx.prisma.tag.findMany({
          where: { id: { in: tagNumList } },
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
      }
      let rtn = {
        lastPostDate: PostResult.length > 0 ? rtnLastPostDate : null,
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

const getResult = async (
  ctx: Context,
  loadingPostNum: number,
  lang: String,
  tagIds: { tags: { some: { id: number } } }[],
  queryDate: Date,
  queryDateTomorrow: Date,
  option?: {
    cursorId?: number;
  }
) => {
  let queryOption = {
    where: {
      AND: tagIds,
      createdAt: { gte: queryDate, lt: queryDateTomorrow },
    },
    take: loadingPostNum,
    orderBy: { priority: "desc" },
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
  if (option && option.cursorId) {
    queryOption.cursor = { id: option.cursorId };
    queryOption.skip = 1;
  }
  let queryResult = await ctx.prisma.post.findMany(queryOption);
  return queryResult;
};
