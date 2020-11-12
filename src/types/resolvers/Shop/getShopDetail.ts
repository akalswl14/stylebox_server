import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getShopDetail = queryField("getShopDetail", {
  type: "ShopDetail",
  args: {
    shopId: intArg({ required: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopId } = args;
      const lang = args.lang ?? "VI";
      let queryResult,
        tagsResult,
        likeResult,
        linkResult,
        shopVideos = [],
        shopImages = [],
        tags = [],
        order = 0,
        isLikeShop = false,
        TopExternalLinks = [],
        BottomExternalLinks = [];
      const userId = Number(getUserId(ctx));

      await ctx.prisma.view.create({
        data: {
          Shop: { connect: { id: shopId } },
          User: { connect: { id: userId } },
        },
      });

      queryResult = await ctx.prisma.shop.findOne({
        where: {
          id: shopId,
        },
        select: {
          logoUrl: true,
          names: { where: { lang }, select: { word: true } },
          posts: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { createdAt: true },
          },
          onDetailTagId: true,
          images: { select: { id: true, url: true, order: true } },
          videos: { select: { id: true, url: true, order: true } },
          branches: { select: { address: true, googleMapUrl: true } },
          description: true,
        },
      });
      if (!queryResult) {
        return null;
      }
      for (const eachVideo of queryResult.videos) {
        shopVideos.push({
          id: eachVideo.id,
          url: eachVideo.url,
          order: eachVideo.order,
        });
      }
      for (const eachImage of queryResult.images) {
        shopImages.push({
          id: eachImage.id,
          url: eachImage.url,
          order: eachImage.order,
        });
      }
      for (const eachTagId of queryResult.onDetailTagId) {
        tagsResult = await ctx.prisma.tag.findOne({
          where: { id: eachTagId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (tagsResult) {
          tags.push({
            id: eachTagId,
            tagName: tagsResult.names[0].word,
            order,
          });
          order++;
        }
      }
      order = 0;
      linkResult = await ctx.prisma.shopExternalLink.findMany({
        where: { shopId, onBottom: false, linkType: "Facebook", isShown: true },
        orderBy: { order: "asc" },
      });
      for (const eachLink of linkResult) {
        TopExternalLinks.push({
          id: eachLink.id,
          url: eachLink.url,
          linkType: eachLink.linkType,
          order: order,
        });
        order++;
      }
      linkResult = await ctx.prisma.shopExternalLink.findMany({
        where: {
          shopId,
          onBottom: false,
          linkType: "Instagram",
          isShown: true,
        },
        orderBy: { order: "asc" },
      });
      for (const eachLink of linkResult) {
        TopExternalLinks.push({
          id: eachLink.id,
          url: eachLink.url,
          linkType: eachLink.linkType,
          order: order,
        });
        order++;
      }
      linkResult = await ctx.prisma.shopExternalLink.findMany({
        where: { shopId, onBottom: false, linkType: "Youtube", isShown: true },
        orderBy: { order: "asc" },
      });
      for (const eachLink of linkResult) {
        TopExternalLinks.push({
          id: eachLink.id,
          url: eachLink.url,
          linkType: eachLink.linkType,
          order: order,
        });
        order++;
      }
      linkResult = await ctx.prisma.shopExternalLink.findMany({
        where: { shopId, onBottom: true, isShown: true },
        orderBy: { order: "asc" },
      });
      for (const eachLink of linkResult) {
        BottomExternalLinks.push({
          id: eachLink.id,
          url: eachLink.url,
          linkType: eachLink.linkType,
          order: eachLink.order,
        });
      }
      likeResult = await ctx.prisma.like.count({
        where: {
          shopId,
          userId,
        },
      });
      isLikeShop = likeResult > 0 ? true : false;
      let branchResult = await ctx.prisma.branch.findMany({
        where: { shopId },
        select: { address: true, googleMapUrl: true },
      });
      let rtn = {
        shopId,
        logoUrl: queryResult.logoUrl,
        shopName: queryResult.names[0].word,
        isLikeShop,
        lastUpdateDate: queryResult.posts[0].createdAt,
        description: queryResult.description,
        tags,
        TopExternalLinks,
        BottomExternalLinks,
        shopImages,
        shopVideos,
        Branches: branchResult,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
