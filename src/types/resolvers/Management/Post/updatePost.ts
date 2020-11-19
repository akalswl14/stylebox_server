import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from "@nexus/schema";

export const updatePostManage = mutationField("updatePostManage", {
  type: "Boolean",
  args: {
    id: intArg({ required: true }),
    mainProductId: intArg({ nullable: true }),
    priority: intArg({ nullable: true }),
    isDescriptionChange: booleanArg({ required: true }),
    description: stringArg({ nullable: true }),
    tags: arg({ type: "IdOrderInputType", nullable: true, list: [true] }),
    externalLinks: arg({ type: "LinkInputType", nullable: true, list: [true] }),
    images: arg({ type: "ImageInputType", nullable: true, list: [true] }),
    videos: arg({ type: "VideoInputType", nullable: true, list: [true] }),
    subProducts: arg({
      type: "idDicInputType",
      nullable: true,
      list: [true],
    }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        id,
        mainProductId,
        isDescriptionChange,
        priority,
        description,
        tags,
        externalLinks,
        images,
        videos,
        subProducts,
      } = args;

      let onDetailTagId: number[] = [],
        queryResult;

      if (externalLinks) {
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

        for (const eachItem of externalLinks) {
          if (eachItem) {
            if (eachItem.isShown)
              ExternalLinkArray.push({
                isShown: eachItem.isShown,
                linkType: eachItem.linkType,
                order: eachItem.order,
                url: eachItem.url,
              });
          }
        }

        await ctx.prisma.postExternalLink.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { postExternalLinks: { create: ExternalLinkArray } },
        });
        if (!queryResult) return false;
      }

      if (images) {
        let ImageArray: { url: string; order: number }[] = [];
        for (const eachItem of images) {
          if (eachItem) ImageArray.push(eachItem);
        }
        await ctx.prisma.postImage.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { images: { create: ImageArray } },
        });
        if (!queryResult) return false;
      }

      if (videos) {
        let VideoArray: {
          isYoutube: boolean;
          order: number;
          url: string;
        }[] = [];
        for (const eachItem of videos) {
          if (eachItem) VideoArray.push(eachItem);
        }
        await ctx.prisma.postVideo.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { videos: { create: VideoArray } },
        });
        if (!queryResult) return false;
      }

      if (subProducts) {
        let SubProductArray: { id: number }[] = [];
        for (const eachItem of subProducts) {
          if (eachItem) {
            SubProductArray.push(eachItem);
          }
        }
        let Products = await ctx.prisma.post.findOne({
          where: { id },
          select: {
            products: { select: { id: true } },
            mainProductId: true,
          },
        });

        if (!Products) return false;

        let disconnect = await ctx.prisma.post.update({
          where: { id },
          data: { products: { disconnect: Products.products } },
        });

        if (Products.mainProductId) {
          SubProductArray.push({ id: Products.mainProductId });
        } else {
          return false;
        }

        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { products: { connect: SubProductArray } },
        });

        if (!disconnect || !queryResult) return false;
      }

      if (priority) {
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { priority },
        });
        if (!queryResult) return false;
      }

      if (isDescriptionChange) {
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { text: description },
        });
        if (!queryResult) return false;
      }

      if (tags) {
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

        let originalTags = await ctx.prisma.tag.findMany({
          where: { posts: { some: { id } } },
          select: { id: true },
        });
        let disconnectResult = await ctx.prisma.post.update({
          where: { id: id },
          data: { tags: { disconnect: originalTags } },
        });

        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: {
            tags: { connect: tagsId },
            onDetailTagId: { set: onDetailTagId },
          },
        });

        if (!disconnectResult || !queryResult) return false;
      }

      if (mainProductId) {
        let products = [];
        let isOnline = true;
        let mainProductInfo = await ctx.prisma.product.findOne({
          where: { id: mainProductId },
          select: { price: true, branches: { select: { shopId: true } } },
        });
        if (!mainProductInfo) return false;
        if (mainProductInfo.price) {
          isOnline = false;
        }
        let mainProductIdUpdate = await ctx.prisma.post.update({
          where: { id },
          data: {
            mainProductId,
            mainProductPrice: mainProductInfo.price,
            isOnline,
          },
        });

        let shopOriginalId = await ctx.prisma.post.findOne({
          where: { id },
          select: { shopId: true },
        });

        if (!shopOriginalId) return false;

        let disconnectResult = await ctx.prisma.post.update({
          where: { id },
          data: { Shop: { disconnect: true } },
        });

        if (mainProductInfo.branches[0].shopId) {
          let shopQueryResult = await ctx.prisma.post.update({
            where: { id },
            data: {
              Shop: { connect: { id: mainProductInfo.branches[0].shopId } },
            },
          });
        } else {
          return false;
        }

        let subProducts = await ctx.prisma.post.findOne({
          where: { id },
          select: { products: { select: { id: true } } },
        });
        if (!subProducts) return false;
        products = [...subProducts?.products, { id: mainProductId }];

        let subProductDisconnect = await ctx.prisma.post.update({
          where: { id },
          data: { products: { disconnect: subProducts.products } },
        });

        let productsResult = await ctx.prisma.post.update({
          where: { id },
          data: { products: { connect: products } },
        });
        if (
          !productsResult ||
          !subProductDisconnect ||
          !mainProductIdUpdate ||
          !disconnectResult
        )
          return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
