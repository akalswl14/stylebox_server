import { intArg, queryField } from "@nexus/schema";

export const getEventThumbnailImage = queryField("getEventThumbnailImage", {
  type: "String",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.event.findOne({
        where: { id },
        select: { bannerImage: true },
      });
      return queryResult?.bannerImage;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
