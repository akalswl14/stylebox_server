import { queryField, stringArg, intArg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getPostDetail = queryField('getPostDetail', {
  type: 'PostDetail',
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
      let mainProductExternalLinks = [],
        postImages = [],
        tags = [],
        products = [],
        isLikePost,
        PostDate,
        YoutubeVideoUrl,
        postPrismaResult,
        order = 0,
        mainProduct;

      if (!lang) lang = 'ENG';

      postPrismaResult = await ctx.prisma.post.findOne({
        where: { id: postId },
        select: {
          preferrers: { select: { userId: true } },
          createdAt: true,
          updatedAt: true,
          mainProductPrice: true,
          shopId: true,
          Shop: {
            select: {
              names: { where: { lang }, select: { word: true } },
              logoUrl: true,
              description: true,
            },
          },
          videos: { select: { isYoutube: true, url: true, order: true } },
          mainProductId: true,
          products: {
            select: {
              id: true,
              price: true,
              mainPostId: true,
              names: { where: { lang }, select: { word: true } },
              externalLinks: {
                select: { url: true, linkType: true, id: true },
              },
              description: true,
            },
          },
          images: { select: { id: true, order: true, url: true } },
          tags: {
            select: {
              id: true,
              names: { where: { lang }, select: { word: true } },
            },
          },
        },
      });

      if (!postPrismaResult) return null;

      for (const eachProduct of postPrismaResult.products) {
        products.push({
          productId: eachProduct.id,
          productName: eachProduct.names[0].word,
          price: eachProduct.price,
          mainPostId: eachProduct.mainPostId,
        });

        if (eachProduct.mainPostId === postId) {
          for (const eachLink of eachProduct.externalLinks) {
            mainProductExternalLinks.push({
              id: eachLink.id,
              url: eachLink.url,
              linkType: eachLink.linkType,
            });
          }
        }
      }

      for (const eachTag of postPrismaResult.tags) {
        tags.push({
          id: eachTag.id,
          order: order++,
          tagName: eachTag.names[0].word,
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

      mainProduct = postPrismaResult.products.filter(
        (item) => item.mainPostId === postId
      );

      YoutubeVideoUrl = postPrismaResult.videos.filter(
        (item) => item.isYoutube === true
      );

      let rtn = {
        postId,
        isLikePost,
        PostDate,
        price: postPrismaResult.mainProductPrice,
        shopId: postPrismaResult.shopId,
        shopName: postPrismaResult.Shop?.names[0].word,
        shopLogoUrl: postPrismaResult.Shop?.logoUrl,
        description: mainProduct[0].description,
        YoutubeVideoUrl: YoutubeVideoUrl[0].url,
        mainProductId: postPrismaResult.mainProductId,
        mainProductName: mainProduct[0].names[0].word,
        mainProductExternalLinks,
        postImages,
        tags,
        products,
      };
      return rtn;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
