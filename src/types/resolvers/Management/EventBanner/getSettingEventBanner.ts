import { intArg, queryField } from "@nexus/schema";

export const getSettingEventBanner = queryField("getSettingEventBanner", {
  type: "EventBanner",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let queryResult,
        bannerIds,
        order = 0,
        events = [];
      queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { mainEventBannerId: true },
      });
      if (!queryResult) return null;
      bannerIds = queryResult.mainEventBannerId;
      for (const eachEvent of bannerIds) {
        queryResult = await ctx.prisma.event.findOne({
          where: { id: eachEvent },
          select: { bannerImage: true, title: true },
        });
        if (!queryResult) return null;
        events.push({
          eventId: eachEvent,
          bannerImage: queryResult.bannerImage,
          order,
          title: queryResult.title,
        });
        order++;
      }
      return events;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
