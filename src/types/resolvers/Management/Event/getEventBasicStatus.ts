import { intArg, queryField } from "@nexus/schema";

export const getEventBasicStatus = queryField("getEventBasicStatus", {
  type: "EventBasicStatus",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult, likesNum, viewsNum;
      queryResult = await ctx.prisma.event.findOne({
        where: { id },
        select: {
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!queryResult) return null;
      likesNum = await ctx.prisma.like.count({
        where: { eventId: id },
      });
      viewsNum = await ctx.prisma.view.count({
        where: { eventId: id },
      });
      return {
        likesNum,
        viewsNum,
        createdAt: queryResult.createdAt,
        updatedAt: queryResult.updatedAt,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
