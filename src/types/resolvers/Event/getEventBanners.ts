import { queryField } from "@nexus/schema";

export const getEventBanners = queryField("getEventBanners", {
  type: "EventBanner",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let prismaResult,
        eventBannersId,
        order = 0,
        rtn: any = [];
      try {
        prismaResult = await ctx.prisma.setting.findOne({
          where: { id: 1 },
          select: { mainEventBannerId: true },
        });

        if (!prismaResult) return null;

        eventBannersId = prismaResult.mainEventBannerId;

        for (const eachId of eventBannersId) {
          prismaResult = await ctx.prisma.event.findOne({
            where: { id: eachId },
            select: { bannerImage: true, id: true },
          });

          if (!prismaResult) return null;

          let rtnObject: {
            eventId?: number | null;
            bannerImage?: string | null;
            order?: number | null;
          } | null = {
            eventId: prismaResult.id,
            bannerImage: prismaResult.bannerImage,
            order: order,
          };

          rtn.push(rtnObject);
          order++;
        }

        return rtn;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
