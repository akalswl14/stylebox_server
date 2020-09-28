import { intArg, queryField } from "@nexus/schema";

export const getProductBasicStatus = queryField("getProductBasicStatus", {
  type: "ProductBasicStatus",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.product.findOne({
        where: { id },
        select: {
          createdAt: true,
          updatedAt: true,
        },
      });
      let postNum = await ctx.prisma.post.count({
        where: { products: { some: { id } } },
      });
      if (!queryResult) return null;
      return {
        postNum,
        createdAt: queryResult.createdAt,
        updatedAt: queryResult.updatedAt,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
