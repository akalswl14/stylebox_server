import { queryField, stringArg, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getPostDetail = queryField("getPostDetail", {
  type: "PostDetail",
  args: {
    lang: stringArg({ nullable: true }),
    postId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      const { postId } = args;
      let { lang } = args;
      let postImages = [],
        tags = [],
        products = [],
        isLikePost,
        PostDate,
        postPrismaResult,
        order = 0,
        mainProduct,
        tagResult;

      if (!lang) lang = "VI";

      await ctx.prisma.view.create({
        data: {
          Post: { connect: { id: postId } },
          User: { connect: { id: userId } },
        },
      });

      postPrismaResult = await ctx.prisma.post.findOne({
        where: { id: postId },
        select: {
          createdAt: true,
          updatedAt: true,
          mainProductPrice: true,
          shopId: true,
          text: true,
          Shop: {
            select: {
              names: { where: { lang }, select: { word: true } },
              logoUrl: true,
              onDetailTagId: true,
            },
          },
          videos: { select: { isYoutube: true, url: true, order: true } },
          mainProductId: true,
          products: {
            select: {
              id: true,
              price: true,
              names: { where: { lang }, select: { word: true } },
              externalLink: {
                select: { id: true, url: true, order: true, linkType: true },
              },
            },
          },
          postExternalLinks: {
            where: { isShown: true },
            orderBy: { order: "asc" },
            select: { url: true, linkType: true, id: true, order: true },
          },
          images: {
            orderBy: { order: "asc" },
            select: { id: true, order: true, url: true },
          },
          onDetailTagId: true,
        },
      });

      if (!postPrismaResult) return null;

      for (const eachProduct of postPrismaResult.products) {
        products.push({
          productId: eachProduct.id,
          productName: eachProduct.names[0].word,
          price: eachProduct.price,
          productExternalLink: eachProduct.externalLink,
        });
      }

      for (const eachTag of postPrismaResult.onDetailTagId) {
        tagResult = await ctx.prisma.tag.findOne({
          where: {
            id: eachTag,
          },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
            category: true,
          },
        });
        if (!tagResult) continue;
        tags.push({
          id: tagResult.id,
          order: order++,
          tagName: tagResult.names[0].word,
          category: tagResult.category,
        });
      }
      for (const eachImage of postPrismaResult.images) {
        postImages.push({
          id: eachImage.id,
          order: eachImage.order,
          url: eachImage.url,
        });
      }

      isLikePost =
        (await ctx.prisma.like.count({
          where: { userId, postId },
        })) > 0
          ? true
          : false;

      PostDate = postPrismaResult.updatedAt
        ? postPrismaResult.updatedAt
        : postPrismaResult.createdAt;

      if (!postPrismaResult.mainProductId) return null;

      mainProduct = await ctx.prisma.product.findOne({
        where: { id: postPrismaResult.mainProductId },
        select: {
          names: { where: { lang }, select: { word: true } },
        },
      });

      if (!mainProduct) return null;

      let shopTags = [];

      if (!postPrismaResult.Shop?.onDetailTagId) return null;

      for (const eachTag of postPrismaResult.Shop?.onDetailTagId) {
        let queryResult = await ctx.prisma.tagName.findMany({
          where: { tagId: eachTag, lang: "VI" },
          select: { word: true },
        });
        if (queryResult.length > 0) shopTags.push(queryResult[0].word);
        if (shopTags.length == 3) break;
      }

      let rtn: any = {
        postId,
        isLikePost,
        PostDate,
        price: postPrismaResult.mainProductPrice,
        shopId: postPrismaResult.shopId,
        shopName: postPrismaResult.Shop?.names[0].word,
        shopLogoUrl: postPrismaResult.Shop?.logoUrl
          ? postPrismaResult.Shop?.logoUrl
          : "",
        shopTags,
        description: postPrismaResult.text ? postPrismaResult.text : "",
        YoutubeVideoUrl:
          postPrismaResult.videos.length > 0
            ? postPrismaResult.videos[0].url
            : "",
        mainProductId: postPrismaResult.mainProductId,
        mainProductName: mainProduct.names[0].word,
        postExternalLinks: postPrismaResult.postExternalLinks,
        postImages,
        tags,
        products,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
