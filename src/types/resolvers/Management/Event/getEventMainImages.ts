import { intArg, queryField } from "@nexus/schema";

export const getEventMainImages = queryField("getEventMainImages", {
  type: "UrlOrder",
  args: { id: intArg({ required: true }) },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.event.findOne({
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
