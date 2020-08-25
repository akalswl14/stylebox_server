import { intArg, stringArg, mutationField, arg, floatArg } from "@nexus/schema";

export const createPost = mutationField("createPost", {
  type: "Post",
  args: {
    title: stringArg({ nullable: true }),
    text: stringArg({ nullable: true }),
    images: arg({ type: "ImageInputType", list: true, nullable: true }),
    publisher: stringArg({ nullable: true }),
    products: intArg({ nullable: true, list: true }),
    tags: arg({ type: "idDicInputType", list: true, nullable: true }),
    videos: arg({ type: "VideoInputType", list: true, nullable: true }),
    mainProductId: intArg({ nullable: true }),
    priority: floatArg({ nullable: true }),
  },
  nullable: true,
  description:
    "images argument is for PostImage and videos argument is for PostVideo.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        title,
        text,
        images = [],
        publisher,
        products = [],
        tags = [],
        videos = [],
        mainProductId,
        priority = 0.0,
      } = args;
      const weeklyRankScore = 0.0,
        lifeTimeRankScore = 0.0,
        monthlyRankScore = 0.0;
      let post,
        shopresult,
        shopId,
        branches: { id: number }[] = [],
        mainProduct,
        mainProductPrice;
      if (mainProductId) {
        try {
          mainProduct = await ctx.prisma.product.findOne({
            where: { id: mainProductId },
            include: { branches: true },
          });
          mainProductPrice = mainProduct?.price;
          branches = mainProduct ? mainProduct.branches : [];
        } catch (e) {
          console.log(e);
        }
        try {
          shopresult = await ctx.prisma.branch.findOne({
            where: {
              id: branches[0].id,
            },
            select: { shopId: true },
          });
          if (shopresult) {
            shopId = shopresult.shopId ? shopresult.shopId : shopId;
          }
        } catch (e) {
          console.log(e);
        }
      }
      try {
        await ctx.prisma.post.create({
          data: {
            title,
            text,
            images: { create: images },
            weeklyRankScore,
            lifeTimeRankScore,
            monthlyRankScore,
            publisher,
            products: { connect: products },
            tags: { connect: tags },
            videos: { create: videos },
            mainProductId,
            mainProductPrice,
            Shop: {
              connect: {
                id: shopId,
              },
            },
            priority,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return post ? post : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
