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
      const { shopId, lang = "ENG" } = args;
      let queryResult,
        tagsResult,
        likeResult,
        shopVideos = [],
        shopImages = [],
        tags = [],
        order = 0,
        isLikeShop = false,
        ExternalLinks = [];
      const userId = Number(getUserId(ctx));
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
          externalLinks: { select: { id: true, url: true, linkType: true } },
          images: { select: { id: true, url: true, order: true } },
          videos: { select: { id: true, url: true, order: true } },
          branches: { select: { address: true, googleMapId: true } },
          gotoshopLink: true,
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
      for (const eachLink of queryResult.externalLinks) {
        ExternalLinks.push({
          id: eachLink.id,
          url: eachLink.url,
          linkType: eachLink.linkType,
        });
      }
      likeResult = await ctx.prisma.like.count({
        where: {
          shopId,
          userId,
        },
      });
      isLikeShop = likeResult > 0 ? true : false;
      let rtn = {
        shopId,
        logoUrl: queryResult.logoUrl,
        shopName: queryResult.names[0].word,
        isLikeShop,
        lastUpdateDate: queryResult.posts[0].createdAt,
        addressUrl: queryResult.gotoshopLink,
        description: queryResult.description,
        tags,
        ExternalLinks,
        shopImages,
        shopVideos,
        Branches: queryResult.branches,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
