import { queryField, intArg, stringArg, arg } from "@nexus/schema";
import { Post } from "@prisma/client";
import { Context } from "nexus-prisma/dist/utils";
import { getUserId } from "../../../utils";

export const getMainPostByTag = queryField("getMainPostByTag", {
  type: "priorityPostList",
  args: {
    lastPostPriority: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    postIds: intArg({ list: true, nullable: true }),
    tags: arg({ type: "idDicInputType", list: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG", postIds = [], lastPostPriority, tags = [] } = args;
      let settingQueryResult,
        loadingPostNum,
        TodaysStylesPeriod,
        queryLoadingPostNum,
        queryPriority = 5,
        queryResult,
        postResult = [],
        rtnLastPostPriority = 5,
        posts = [],
        tagIdList = [];
      const userId = Number(getUserId(ctx));
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
      queryLoadingPostNum = loadingPostNum;
      const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let queryDate = new Date();
      queryDate.setUTCDate(today.getUTCDate() - TodaysStylesPeriod);
      queryDate.setUTCHours(0, 0, 0, 0);
      queryPriority = lastPostPriority ? lastPostPriority : 5;

      for (const eachTag of tags) {
        tagIdList.push({ tags: { some: { id: eachTag.id } } });
      }

      while (postResult.length < loadingPostNum && queryPriority >= 0) {
        queryResult = await getfindManyResult(
          ctx,
          queryDate,
          lang,
          queryPriority,
          postIds,
          tagIdList
        );
        let randomPostResult = await getRandomResult(
          queryLoadingPostNum,
          queryResult
        );
        postResult.push(...randomPostResult);
        if (queryResult.length < queryLoadingPostNum) {
          queryLoadingPostNum = loadingPostNum - postResult.length;
        }
        queryPriority--;
      }
      console.log(postResult);
      if (postResult.length > 0) {
        rtnLastPostPriority = postResult[postResult.length - 1].priority;
        for (const eachPost of postResult) {
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
            locationTagName: eachPost.tags[0].names[0].word,
          });
        }
      }
      let rtn = {
        lastPostPriority: rtnLastPostPriority,
        posts,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});

const getfindManyResult = async (
  ctx: Context,
  queryDate: Date,
  lang: String,
  priority: number,
  postIds = [],
  tagIdList = []
) => {
  let queryResult = await ctx.prisma.post.findMany({
    where: {
      priority,
      id: { notIn: postIds },
      createdAt: { gte: queryDate },
      AND: tagIdList,
    },
    select: {
      id: true,
      Shop: { select: { names: { where: { lang }, select: { word: true } } } },
      mainProductId: true,
      mainProductPrice: true,
      tags: {
        where: { category: "Location" },
        select: { names: { where: { lang }, select: { word: true } } },
      },
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
      priority: true,
    },
  });
  return queryResult;
};

const getRandomResult = async (loadingPostNum: number, posts: Post[]) => {
  let results: Post[] = [];
  console.log("RANDOM INPUT : ", posts);
  while (results.length < loadingPostNum && posts.length > 0) {
    let postNum = posts.length;
    let randomIdx = await Math.floor(Math.random() * postNum);
    await results.push(posts[randomIdx]);
    await posts.splice(randomIdx, 1);
    console.log("IN WHILE ", results);
  }
  return results;
};
