import { queryField, intArg, stringArg, arg } from "@nexus/schema";
import { Post } from "@prisma/client";
import { Context } from "nexus-prisma/dist/utils";
import { getUserId } from "../../../utils";

export const getMainPosts = queryField("getMainPosts", {
  type: "priorityPostList",
  args: {
    lastPostPriority: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
    locationTagId: intArg({ nullable: true }),
    postIds: intArg({ list: [true], nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lastPostPriority, locationTagId } = args;
      const lang = args.lang ?? "VI";
      const postIds = args.postIds ?? [];
      let settingQueryResult,
        loadingPostNum,
        TodaysStylesDate,
        queryLoadingPostNum,
        queryPriority = 5,
        queryResult,
        postResult = [],
        rtnLastPostPriority = 5,
        posts = [];
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true, TodaysStylesPeriod: true },
      });
      if (!settingQueryResult) {
        console.log("Setting Query's result is null.");
        return null;
      }
      loadingPostNum = settingQueryResult.loadingPostNum;
      TodaysStylesDate = settingQueryResult.TodaysStylesPeriod;
      TodaysStylesDate.setUTCHours(0, 0, 0, 0);
      queryLoadingPostNum = loadingPostNum;

      queryPriority = lastPostPriority ? lastPostPriority : 5;
      while (postResult.length < loadingPostNum && queryPriority > 0) {
        queryResult = await getfindManyResult(
          ctx,
          TodaysStylesDate,
          lang,
          queryPriority,
          postIds,
          locationTagId
        );
        let randomPostResult: {
          Shop: {
            names: {
              word: string;
            }[];
          } | null;
          id: number;
          mainProductId: number | null;
          mainProductPrice: number | null;
          images: {
            url: string;
          }[];
          priority: number | null;
        }[] = await getRandomResult(queryLoadingPostNum, queryResult);
        postResult.push(...randomPostResult);
        if (queryResult.length < queryLoadingPostNum) {
          queryLoadingPostNum = loadingPostNum - postResult.length;
        }
        queryPriority--;
      }
      if (postResult.length > 0) {
        rtnLastPostPriority = postResult[postResult.length - 1].priority ?? 1;
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
          if (!eachPost.Shop) continue;
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
        lastPostPriority: rtnLastPostPriority,
        postNum: posts.length,
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
  lang: string,
  priority: number,
  postIds: number[] = [],
  locationTagId?: number | null | undefined
) => {
  let queryResult;
  let tags;
  if (locationTagId === 35) {
    let othersTagInfo = await ctx.prisma.tag.findMany({
      where: { classId: 15 },
      select: { id: true },
    });
    tags = { some: { OR: othersTagInfo } };
  } else {
    if (locationTagId) tags = { some: { id: locationTagId } };
    else tags = undefined;
  }
  queryResult = await ctx.prisma.post.findMany({
    where: {
      priority,
      id: { notIn: postIds },
      createdAt: { gte: queryDate },
      tags,
    },
    select: {
      id: true,
      Shop: {
        select: { names: { where: { lang }, select: { word: true } } },
      },
      mainProductId: true,
      mainProductPrice: true,
      images: { select: { url: true }, orderBy: { order: "asc" }, take: 1 },
      priority: true,
    },
  });
  return queryResult;
};

const getRandomResult = async (
  loadingPostNum: number,
  posts: {
    Shop: {
      names: {
        word: string;
      }[];
    } | null;
    id: number;
    mainProductId: number | null;
    mainProductPrice: number | null;
    images: {
      url: string;
    }[];
    priority: number | null;
  }[]
) => {
  let results: {
    Shop: {
      names: {
        word: string;
      }[];
    } | null;
    id: number;
    mainProductId: number | null;
    mainProductPrice: number | null;
    images: {
      url: string;
    }[];
    priority: number | null;
  }[] = [];
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
