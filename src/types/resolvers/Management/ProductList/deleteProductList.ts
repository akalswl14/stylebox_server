import { intArg, mutationField } from "@nexus/schema";

export const deleteProductList = mutationField("deleteProductList", {
  type: "Boolean",
  args: {
    productIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { productIds = [] } = args;
      let deleteQuery, queryResult;

      deleteQuery = await ctx.prisma.productImage.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productName.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productVideo.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.like.deleteMany({
        where: { productId: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.view.deleteMany({
        where: { productId: { in: productIds } },
      });
      let productLinkIds = await ctx.prisma.productExternalLink.findMany({
        where: { productId: { in: productIds } },
        select: { id: true },
      });
      queryResult = await ctx.prisma.product.deleteMany({
        where: { id: { in: productIds } },
      });
      deleteQuery = await ctx.prisma.productExternalLink.deleteMany({
        where: { OR: productLinkIds },
      });

      let postQuery = await ctx.prisma.post.findMany({
        where: { mainProductId: { in: productIds } },
        select: { id: true },
      });

      let postIds = [];

      for (const eachData of postQuery) {
        postIds.push(eachData.id);
      }

      if (postIds.length > 0) {
        deleteQuery = await ctx.prisma.postExternalLink.deleteMany({
          where: { postId: { in: postIds } },
        });
        deleteQuery = await ctx.prisma.postImage.deleteMany({
          where: { postId: { in: postIds } },
        });
        deleteQuery = await ctx.prisma.postVideo.deleteMany({
          where: { postId: { in: postIds } },
        });
        deleteQuery = await ctx.prisma.like.deleteMany({
          where: { postId: { in: postIds } },
        });
        deleteQuery = await ctx.prisma.view.deleteMany({
          where: { postId: { in: postIds } },
        });
        queryResult = await ctx.prisma.post.deleteMany({
          where: { id: { in: postIds } },
        });
      }

      if (!deleteQuery || !queryResult) return false;

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
