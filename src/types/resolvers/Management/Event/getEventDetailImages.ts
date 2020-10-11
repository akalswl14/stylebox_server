import { intArg, queryField } from "@nexus/schema";

export const getEventDetailImages = queryField("getEventDetailImages", {
  type: "UrlOrder",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.event.findOne({
        where: { id },
        select: {
          contentsImages: {
            select: { order: true, url: true },
            orderBy: { order: "asc" },
          },
        },
      });
      if (!queryResult) return null;
      return queryResult.contentsImages;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
