import { intArg, queryField } from "@nexus/schema";

export const getShopImages = queryField("getShopImages", {
  type: "UrlOrder",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          images: {
            select: { order: true, url: true },
            orderBy: { order: "asc" },
          },
        },
      });
      if (!queryResult) return null;
      return queryResult.images;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
