import { mutationField } from "@nexus/schema";
import { Post, Shop } from "@prisma/client";
import AWS, { Credentials } from "aws-sdk";
import { BUCKET_NAME, IAM_ID, IAM_SECRETKEY, S3_REGION } from "../AWS_IAM";
const access = new Credentials({
  accessKeyId: IAM_ID,
  secretAccessKey: IAM_SECRETKEY,
});

const s3 = new AWS.S3({
  credentials: access,
  region: S3_REGION,
});

export const updateRankScore = mutationField("updateRankScore", {
  type: "Boolean",
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      let postResult,
        queryResult,
        shopListResult,
        order = 1,
        PostWeekLikeNum = 0,
        PostMonthLikeNum = 0,
        PostLifeLikeNum = 0,
        PostWeekViewNum = 0,
        PostMonthViewNum = 0,
        PostLifeViewNum = 0,
        ShopMonthLikeNum = 0,
        ShopMonthViewNum = 0,
        weeklyRankScore = 0,
        monthlyRankScore = 0,
        lifeTimeRankScore = 0,
        ShopmonthlyRankScore = 0,
        ShopPostNum = 0;
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: {
          bestConstA: true,
          bestConstB: true,
          shopConstA: true,
          shopConstB: true,
          shopConstC: true,
        },
      });
      if (!queryResult)
        return await uploadJsonLog(
          [],
          [],
          false,
          "Error while getting setting data"
        );
      const bestConstA = queryResult.bestConstA;
      const bestConstB = queryResult.bestConstB;
      const shopConstA = queryResult.shopConstA;
      const shopConstB = queryResult.shopConstB;
      const shopConstC = queryResult.shopConstC;
      const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
      let before7Days = new Date();
      let before1Month = new Date();
      before7Days.setUTCDate(today.getUTCDate() - 7);
      before7Days.setUTCHours(0, 0, 0, 0);
      before1Month.setUTCDate(today.getUTCDate() - 30);
      before1Month.setUTCHours(0, 0, 0, 0);
      queryResult = await ctx.prisma.shop.updateMany({
        data: { monthlyRankScore: { set: 0.0 } },
      });
      if (!queryResult)
        return await uploadJsonLog(
          [],
          [],
          false,
          "Error while setting shop monthlyRankScore 0.0"
        );
      postResult = await ctx.prisma.post.findMany({
        select: {
          id: true,
          shopId: true,
          Shop: { select: { monthlyRankScore: true } },
        },
      });
      for (const eachPost of postResult) {
        PostWeekLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id, createdAt: { gte: before7Days } },
        });
        PostMonthLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id, createdAt: { gte: before1Month } },
        });
        PostLifeLikeNum = await ctx.prisma.like.count({
          where: { postId: eachPost.id },
        });
        PostWeekViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id, createdAt: { gte: before7Days } },
        });
        PostMonthViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id, createdAt: { gte: before1Month } },
        });
        PostLifeViewNum = await ctx.prisma.view.count({
          where: { postId: eachPost.id },
        });
        weeklyRankScore =
          bestConstA * PostWeekLikeNum + bestConstB * PostWeekViewNum;
        monthlyRankScore =
          bestConstA * PostMonthLikeNum + bestConstB * PostMonthViewNum;
        lifeTimeRankScore =
          bestConstA * PostLifeLikeNum + bestConstB * PostLifeViewNum;
        queryResult = await ctx.prisma.post.update({
          where: {
            id: eachPost.id,
          },
          data: {
            weeklyRankScore: { set: weeklyRankScore },
            monthlyRankScore: { set: monthlyRankScore },
            lifeTimeRankScore: { set: lifeTimeRankScore },
          },
        });
        if (!queryResult)
          return await uploadJsonLog(
            [],
            [],
            false,
            "Error while updating post data."
          );
        if (eachPost.shopId) {
          ShopMonthLikeNum = await ctx.prisma.like.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          ShopMonthViewNum = await ctx.prisma.view.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          ShopPostNum = await ctx.prisma.post.count({
            where: {
              shopId: eachPost.shopId,
              createdAt: { gte: before1Month },
            },
          });
          let shopResult = await ctx.prisma.shop.findOne({
            where: {
              id: eachPost.shopId,
            },
            select: {
              priority: true,
            },
          });
          let shopPriority =
            shopResult && shopResult.priority ? shopResult.priority : 1;
          ShopmonthlyRankScore =
            (shopConstA * ShopMonthViewNum +
              shopConstB +
              ShopMonthLikeNum +
              shopConstC * monthlyRankScore) /
              ShopPostNum +
            shopPriority;
          if (eachPost.Shop && eachPost.Shop.monthlyRankScore) {
            ShopmonthlyRankScore += eachPost.Shop.monthlyRankScore;
          }
          queryResult = await ctx.prisma.shop.update({
            where: { id: eachPost.shopId },
            data: { monthlyRankScore: { set: ShopmonthlyRankScore } },
          });
          if (!queryResult)
            return await uploadJsonLog(
              [],
              [],
              false,
              "Error while updating shop monthlyRankScore"
            );
        }
      }
      postResult = await ctx.prisma.post.findMany({
        orderBy: {
          weeklyRankScore: "desc",
        },
      });
      for (const eachPost of postResult) {
        queryResult = await ctx.prisma.post.update({
          where: { id: eachPost.id },
          data: { weeklyRankNum: order },
        });
        if (!queryResult)
          return await uploadJsonLog(
            [],
            [],
            false,
            "Error while updating post weeklyRankNum"
          );
        order++;
      }
      order = 0;
      postResult = await ctx.prisma.post.findMany({
        orderBy: {
          monthlyRankScore: "desc",
        },
      });
      for (const eachPost of postResult) {
        queryResult = await ctx.prisma.post.update({
          where: { id: eachPost.id },
          data: { monthlyRankNum: order },
        });
        if (!queryResult)
          return await uploadJsonLog(
            [],
            [],
            false,
            "Error while updating post monthlyRankNum"
          );
        order++;
      }
      order = 0;
      postResult = await ctx.prisma.post.findMany({
        orderBy: {
          lifeTimeRankScore: "desc",
        },
      });
      for (const eachPost of postResult) {
        queryResult = await ctx.prisma.post.update({
          where: { id: eachPost.id },
          data: { lifeTimeRankNum: order },
        });
        if (!queryResult)
          return await uploadJsonLog(
            [],
            [],
            false,
            "Error while updating post lifeTimeRankNum"
          );
        order++;
      }
      order = 0;
      shopListResult = await ctx.prisma.shop.findMany({
        orderBy: {
          monthlyRankScore: "desc",
        },
      });
      for (const eachShop of shopListResult) {
        queryResult = await ctx.prisma.shop.update({
          where: { id: eachShop.id },
          data: { monthlyRankNum: order },
        });
        if (!queryResult)
          return await uploadJsonLog(
            [],
            [],
            false,
            "Error while updating shop monthlyRankNum"
          );
        order++;
      }
      return await uploadJsonLog(postResult, shopListResult, true, "-");
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});

const uploadJsonLog = async (
  postResult: Post[],
  shopListResult: Shop[],
  result: Boolean,
  status: String
) => {
  try {
    const now = new Date();
    const jsonObject = {
      Date: now,
      result: result,
      posts: postResult,
      shops: shopListResult,
      status,
    };
    JSON.stringify(jsonObject);
    const bufferObject = Buffer.from(JSON.stringify(jsonObject));
    const fileKey = "RankUpdateLog/" + now.getTime() + ".json";
    var params = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: bufferObject,
      CacheControl: "public, max-age=3600",
      ContentType: "application/json",
    };
    await s3.putObject(params, (err, data) => {
      if (err) return false;
      if (data) return true;
    });
    return true;
  } catch (e) {
    return false;
  }
};
