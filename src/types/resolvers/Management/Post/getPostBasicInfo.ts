import { intArg, queryField } from "@nexus/schema";

export const getPostBasicInfo = queryField("getPostBasicInfo", {
  type: "PostBasicInfo",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let lang, postInfo;
      if (!lang) lang = "VI";

      let postResult = await ctx.prisma.post.findOne({
        where: { id },
        select: {
          id: true,
          mainProductId: true,
          mainProductPrice: true,
          shopId: true,
          Shop: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      });

      if (!postResult) return null;

      if (postResult.mainProductId) {
        let productName = await ctx.prisma.product.findOne({
          where: { id: postResult.mainProductId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (!productName) return null;
        postInfo = {
          postId: postResult.id,
          mainProductId: postResult.mainProductId,
          mainProductName: productName.names[0].word,
          price: postResult.mainProductPrice,
          shopId: postResult.shopId,
          shopName: postResult.Shop?.names[0].word,
        };
      } else {
        return null;
      }

      return postInfo ? postInfo : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
