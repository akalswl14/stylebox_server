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
      const { postId } = args;
      let { lang } = args;
      let postImages = [],
        tags = [],
        products = [],
        isLikePost,
        PostDate,
        YoutubeVideoUrl,
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
          preferrers: { select: { userId: true } },
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
            select: { url: true, linkType: true, id: true, order: true },
          },
          images: { select: { id: true, order: true, url: true } },
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
          },
        });

        tags.push({
          id: tagResult?.id,
          order: order++,
          tagName: tagResult?.names[0].word,
        });
      }

      for (const eachImage of postPrismaResult.images) {
        postImages.push({
          id: eachImage.id,
          order: eachImage.order,
          url: eachImage.url,
        });
      }

      isLikePost = postPrismaResult.preferrers.filter(
        (preferrer) => preferrer.userId === userId
      )
        ? true
        : false;

      PostDate = postPrismaResult.updatedAt
        ? postPrismaResult.updatedAt
        : postPrismaResult.createdAt;

      mainProduct = await ctx.prisma.product.findOne({
        where: { id: postPrismaResult.mainProductId },
        select: {
          names: { where: { lang }, select: { word: true } },
        },
      });

      YoutubeVideoUrl = postPrismaResult.videos.filter(
        (item) => item.isYoutube === true
      );

      let shopTags = [];
      for (const eachTag of postPrismaResult.Shop?.onDetailTagId) {
        let queryResult = await ctx.prisma.tagName.findMany({
          where: { tagId: eachTag, lang: "VI" },
          select: { word: true },
        });
        if (queryResult.length > 0) shopTags.push(queryResult[0].word);
        if (shopTags.length == 3) break;
      }

      let rtn = {
        postId,
        isLikePost,
        PostDate,
        price: postPrismaResult.mainProductPrice,
        shopId: postPrismaResult.shopId,
        shopName: postPrismaResult.Shop?.names[0].word,
        shopLogoUrl: postPrismaResult.Shop?.logoUrl,
        shopTags,
        description: postPrismaResult.text,
        YoutubeVideoUrl: YoutubeVideoUrl[0].url,
        mainProductId: postPrismaResult.mainProductId,
        mainProductName: mainProduct.names[0].word,
        mainProductExternalLinks: postPrismaResult.postExternalLinks,
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
