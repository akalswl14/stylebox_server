import { arg, intArg, mutationField, stringArg } from '@nexus/schema';

export const createPostManage = mutationField('createPostManage', {
  type: 'Boolean',
  args: {
    mainProductId: intArg({ nullable: true }),
    priority: intArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    tags: arg({ type: 'IdOrderInputType', required: true, list: true }),
    externalLinks: arg({ type: 'LinkInputType', required: true, list: true }),
    images: arg({ type: 'ImageInputType', required: true, list: true }),
    videos: arg({ type: 'VideoInputType', required: true, list: true }),
    subProducts: arg({
      type: 'idDicInputType',
      required: true,
      list: true,
    }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        mainProductId,
        priority,
        description,
        tags = [],
        externalLinks = [],
        images = [],
        videos = [],
        subProducts = [],
      } = args;

      const weeklyRankScore = 0.0,
        lifeTimeRankScore = 0.0,
        monthlyRankScore = 0.0;

      const weeklyRankNum = 0,
        monthlyRankNum = 0,
        lifeTimeRankNum = 0,
        externalLinkClickNum = 0;

      let isOnline = true;
      let onDetailTagId = [],
        products = [],
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

      let tagsId = [];

      for (const tag of tags) {
        tagsId.push({ id: tag.id });
      }

      tags.sort((a, b) => (a.order < b.order ? -1 : a.order > b.order ? 1 : 0));

      for (const tag of tags) {
        onDetailTagId.push(tag.id);
      }

      let postResult = await ctx.prisma.post.create({
        data: {
          mainProductId,
          mainProductPrice: price,
          priority,
          text: description,
          tags: { connect: tagsId },
          postExternalLinks: { create: externalLinks },
          images: { create: images },
          videos: { create: videos },
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
      });
      return postResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
