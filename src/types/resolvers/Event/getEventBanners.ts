import { queryField } from '@nexus/schema';

export const getEventBanners = queryField('getEventBanners', {
  type: 'EventBanner',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let prismaResult,
        eventBannersId,
        order = 0,
        rtn = [];
      try {
        prismaResult = await ctx.prisma.setting.findOne({
          where: { id: 1 },
          select: { mainEventBannerId: true },
        });
        eventBannersId = prismaResult?.mainEventBannerId;

        if (eventBannersId) {
          for (const eachId of eventBannersId) {
            prismaResult = await ctx.prisma.event.findOne({
              where: { id: eachId },
              select: { bannerImage: true },
            });
            order++;
            rtn.push({
              id: eachId,
              bannerImage: prismaResult?.bannerImage,
              order,
            });
          }
        }
        return rtn ? rtn : null;
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
