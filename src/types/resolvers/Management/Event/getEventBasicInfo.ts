import { intArg, queryField } from "@nexus/schema";

export const getEventBasicInfo = queryField("getEventBasicInfo", {
  type: "EventBasicInfo",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult;
      queryResult = await ctx.prisma.event.findOne({
        where: { id },
        select: {
          isOnList: true,
          startDate: true,
          dueDate: true,
          title: true,
          url: true,
        },
      });
      if (!queryResult) return null;
      return {
        id,
        isOnList: queryResult.isOnList,
        title: queryResult.title,
        startDate: queryResult.startDate,
        endDate: queryResult.dueDate,
        url: queryResult.url,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
