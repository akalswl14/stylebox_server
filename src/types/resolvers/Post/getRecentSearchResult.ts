import { queryField, stringArg, intArg, arg } from "@nexus/schema";
import { Context } from "nexus-prisma/dist/utils";
import { getUserId } from "../../../utils";

export const getRecentSearchResult = queryField("getRecentSearchResult", {
  type: "searchResultList",
  args: {
    tags: arg({ type: "TagClassIdInputType", required: true, list: [true] }),
    lang: stringArg({ nullable: true }),
    lastPostDate: arg({ type: "DateTime", nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tags, lang = "VI", lastPostDate, cursorId } = args;
      let queryResult,
        TagResult = [],
        PostResult = [],
        ClassResult,
        loadingPostNum,
        queryLoadingPostNum,
        totalPostNum,
        inputLastDate,
        rtnLastPostDate,
        functionOption = {},
        tagIds = [],
        tagNumList = [],
        posts = [];
      const userId = Number(getUserId(ctx));
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, SearchPeriod: true },
      });
      if (!queryResult) return null;
      loadingPostNum = queryResult.loadingPostNum;
      let searchDate = queryResult?.SearchPeriod;
      searchDate.setUTCHours(0, 0, 0, 0);
      queryLoadingPostNum = loadingPostNum;
      let queryDate = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let queryDateTomorrow = new Date(new Date().setUTCHours(24, 0, 0, 0));
      inputLastDate = lastPostDate ? Date.parse(lastPostDate) : new Date();
      for (const eachTag of tags) {
        if (eachTag.isClass && eachTag.classId) {
          ClassResult = await ctx.prisma.class.findOne({
            where: { id: eachTag.classId },
            select: { tags: { select: { id: true } } },
          });
          if (ClassResult) {
            let tmpTags = ClassResult.tags;
            let tmpTagIds = [];
            for (const eachTag of tmpTags) {
              if (eachTag.id) {
                tagNumList.push(eachTag.id);
                tmpTagIds.push({ id: eachTag.id });
              }
            }
            tagIds.push({ tags: { some: { OR: tmpTagIds } } });
          }
        } else if (eachTag.tagId) {
          tagIds.push({ tags: { some: { id: eachTag.tagId } } });
          tagNumList.push(eachTag.tagId);
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
          queryLoadingPostNum,
          tagIds,
          queryDate,
          queryDateTomorrow,
          functionOption
        );
        PostResult.push(...queryResult);
        queryLoadingPostNum = loadingPostNum - PostResult.length;
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
          let shopResult = await ctx.prisma.shopName.findMany({
            where: { shopId: eachPost.shopId, lang },
            select: { word: true },
          });
          let productResult = await ctx.prisma.productName.findMany({
            where: { productId: eachPost.mainProductId, lang },
            select: { word: true },
          });
          if (!shopResult || !productResult) return false;
          let productName = productResult[0].word;
          posts.push({
            postId: eachPost.id,
            productName,
            shopName: shopResult[0].word,
            postImage: eachPost.images[0].url,
            price: eachPost.mainProductPrice,
            isLikePost,
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
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      shopId: true,
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
