import { arg, intArg, mutationField, stringArg } from "@nexus/schema";

export const createPostManage = mutationField("createPostManage", {
  type: "PostTagInfo",
  args: {
    mainProductId: intArg({ nullable: true }),
    priority: intArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    tags: arg({ type: "IdOrderInputType", required: true, list: [true] }),
    externalLinks: arg({ type: "LinkInputType", required: true, list: [true] }),
    images: arg({ type: "ImageInputType", required: true, list: [true] }),
    videos: arg({ type: "VideoInputType", required: true, list: [true] }),
    subProducts: arg({
      type: "idDicInputType",
      required: true,
      list: [true],
    }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        mainProductId,
        priority,
        description,
        tags,
        externalLinks,
        videos,
        images,
        subProducts,
      } = args;

      let ImageArray: { url: string; order: number }[] = [];
      let VideoArray: { isYoutube: boolean; order: number; url: string }[] = [];
      let ExternalLinkArray: {
        isShown: boolean;
        linkType:
          | "Facebook"
          | "FacebookMessanger"
          | "Instagram"
          | "LAZADA"
          | "OnlineShop"
          | "Sendo"
          | "Shopee"
          | "Tiki"
          | "TikTok"
          | "Youtube"
          | "Cafe24";
        order: number;
        url: string;
      }[] = [];

      if (images) {
        for (const eachItem of images) {
          if (eachItem) ImageArray.push(eachItem);
        }
      }

      if (videos) {
        for (const eachItem of videos) {
          if (eachItem) VideoArray.push(eachItem);
        }
      }

      if (externalLinks) {
        for (const eachItem of externalLinks) {
          if (eachItem) {
            ExternalLinkArray.push({
              isShown: eachItem.isShown ? true : false,
              linkType: eachItem.linkType,
              order: eachItem.order,
              url: eachItem.url,
            });
          }
        }
      }

      const weeklyRankScore = 0.0,
        lifeTimeRankScore = 0.0,
        monthlyRankScore = 0.0;

      const weeklyRankNum = 0,
        monthlyRankNum = 0,
        lifeTimeRankNum = 0,
        externalLinkClickNum = 0;

      let isOnline = true;
      let onDetailTagId: number[] = [],
        products: { id: number }[] = [],
        shopId,
        price;

      if (mainProductId) {
        let mainProductInfo = await ctx.prisma.product.findOne({
          where: { id: mainProductId },
          select: { price: true, branches: { select: { shopId: true } } },
        });

        products = [...subProducts, { id: mainProductId }];

        if (mainProductInfo?.price) {
          isOnline = false;
        }
        price = mainProductInfo ? mainProductInfo.price : null;
        shopId = mainProductInfo ? mainProductInfo.branches[0].shopId : shopId;
      } else {
        products = [...subProducts];
      }

      let tagsId: { id: number }[] = [];

      for (const tag of tags) {
        if (tag) {
          if (tag.id) tagsId.push({ id: tag.id });
        }
      }

      let TagsArray: { id: number; order: number }[] = [];
      for (const tag of tags) {
        if (tag) {
          if (tag.id && tag.order)
            TagsArray.push({ id: tag.id, order: tag.order });
        }
      }

      TagsArray.sort((a, b) =>
        a.order < b.order ? -1 : a.order > b.order ? 1 : 0
      );

      for (const tag of TagsArray) {
        onDetailTagId.push(tag.id);
      }

      if (!shopId) return null;

      let postResult = await ctx.prisma.post.create({
        data: {
          mainProductId,
          mainProductPrice: price,
          priority,
          text: description,
          tags: { connect: tagsId },
          postExternalLinks: { create: ExternalLinkArray },
          videos: { create: VideoArray },
          products: { connect: products },
          onDetailTagId: { set: onDetailTagId },
          externalLinkClickNum,
          weeklyRankScore,
          lifeTimeRankScore,
          monthlyRankScore,
          weeklyRankNum,
          monthlyRankNum,
          lifeTimeRankNum,
          isOnline,
          Shop: {
            connect: { id: shopId },
          },
        },
        select: {
          id: true,
        },
      });

      if (!postResult) return null;

      if (ImageArray) {
        ImageArray.sort((a, b) =>
          a.order < b.order ? -1 : a.order > b.order ? 1 : 0
        );
        const createPostImage = [];
        for (const image of ImageArray) {
          const s3ImageKey = "Post/" + postResult.id + "/" + image.url;
          createPostImage.push({ order: image.order, url: s3ImageKey });
        }

        let createImage = await ctx.prisma.post.update({
          where: { id: postResult.id },
          data: { images: { create: createPostImage } },
        });

        if (!createImage) return null;
      }

      return postResult ? { postId: postResult.id } : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
