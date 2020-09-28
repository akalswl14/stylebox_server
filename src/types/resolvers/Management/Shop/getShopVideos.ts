import { intArg, queryField } from "@nexus/schema";

export const getShopVideos = queryField("getShopVideos", {
  type: "UrlOrder",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          videos: {
            select: { order: true, url: true, isYoutube: true },
            orderBy: { order: "asc" },
          },
        },
      });
      return queryResult?.videos;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
