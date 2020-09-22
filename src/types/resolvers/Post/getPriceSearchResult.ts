import { queryField, stringArg, intArg, arg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getPriceSearchResult = queryField("getPriceSearchResult", {
  type: "searchResultList",
  args: {
    tags: arg({ type: "TagClassIdInputType", required: true, list: true }),
    filter: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
  },
  nullable: true,
  description: "About filter, 2 means Price Low and 3 means Price High",
  resolve: async (_, args, ctx) => {
    try {
      const { tags, filter = 1, lang = "VI", cursorId } = args;
      let queryResult,
        TagResult = [],
        PostResult = [],
        ClassResult,
        loadingPostNum,
        totalPostNum,
        rtnLastPostDate,
        queryOption,
        tagIds = [],
        classTags = [],
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
      queryOption = {
        where: {
          AND: tagIds,
          createdAt: { gte: searchDate },
        },
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
      if (filter == 2) {
        queryOption.orderBy = [
          { isOnline: "asc" },
          { mainProductPrice: "asc" },
        ];
      } else {
        queryOption.orderBy = [
          { isOnline: "desc" },
          { mainProductPrice: "desc" },
        ];
      }
      if (cursorId) {
        queryOption.cursor = { id: cursorId };
        queryOption.skip = 1;
      }
      PostResult = await ctx.prisma.post.findMany(queryOption);

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
            productName,
            shopName: eachPost.Shop.names[0].word,
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
