import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from '@nexus/schema';

export const updatePostManage = mutationField('updatePostManage', {
  type: 'Boolean',
  args: {
    id: intArg({ required: true }),
    mainProductId: intArg({ nullable: true }),
    priority: intArg({ nullable: true }),
    isDescriptionChange: booleanArg({ required: true }),
    description: stringArg({ nullable: true }),
    tags: arg({ type: 'IdOrderInputType', nullable: true, list: true }),
    externalLinks: arg({ type: 'LinkInputType', nullable: true, list: true }),
    images: arg({ type: 'ImageInputType', nullable: true, list: true }),
    videos: arg({ type: 'VideoInputType', nullable: true, list: true }),
    subProducts: arg({
      type: 'idDicInputType',
      nullable: true,
      list: true,
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
        tags = [],
        externalLinks = [],
        images = [],
        videos = [],
        subProducts = [],
      } = args;

      let onDetailTagId = [],
        queryResult;

      if (externalLinks) {
        await ctx.prisma.postExternalLink.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { postExternalLinks: { create: externalLinks } },
        });
        if (!queryResult) return null;
      }

      if (images) {
        await ctx.prisma.postImage.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { images: { create: images } },
        });
        if (!queryResult) return null;
      }

      if (videos) {
        await ctx.prisma.postVideo.deleteMany({
          where: { postId: id },
        });
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { videos: { create: videos } },
        });
      }

      if (subProducts) {
        let Products = await ctx.prisma.post.findOne({
          where: { id },
          select: { products: { select: { id: true } } },
        });

        if (!Products) return null;

        let disconnect = await ctx.prisma.post.update({
          where: { id },
          data: { products: { disconnect: Products.products } },
        });

        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { products: { connect: subProducts } },
        });

        if (!disconnect || !queryResult) return null;
      }

      if (priority) {
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { priority },
        });
        if (!queryResult) return null;
      }
      if (isDescriptionChange) {
        queryResult = await ctx.prisma.post.update({
          where: { id },
          data: { text: description },
        });
        if (!queryResult) return null;
      }
      if (tags) {
        let tagsId = [];
        for (const tag of tags) {
          tagsId.push({ id: tag.id });
        }
        tags.sort((a, b) =>
          a.order < b.order ? -1 : a.order > b.order ? 1 : 0
        );
        for (const tag of tags) {
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

        if (!disconnectResult || !queryResult) return null;
      }

      if (mainProductId) {
        let products = [];
        let isOnline = true;
        let mainProductInfo = await ctx.prisma.product.findOne({
          where: { id: mainProductId },
          select: { price: true, branches: { select: { shopId: true } } },
        });
        if (!mainProductInfo) return null;
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

        if (!shopOriginalId) return null;

        let disconnectResult = await ctx.prisma.post.update({
          where: { id },
          data: { Shop: { disconnect: shopOriginalId.shopId } },
        });

        let shopQueryResult = await ctx.prisma.post.update({
          where: { id },
          data: {
            Shop: { connect: { id: mainProductInfo.branches[0].shopId } },
          },
        });

        let subProducts = await ctx.prisma.post.findOne({
          where: { id },
          select: { products: { select: { id: true } } },
        });
        if (!subProducts) return null;
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
          !shopQueryResult ||
          !mainProductIdUpdate ||
          !disconnectResult
        )
          return null;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
