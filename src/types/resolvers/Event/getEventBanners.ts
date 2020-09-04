import { queryField } from '@nexus/schema';

export const getEventBanners = queryField('getEventBanners', {
  type: 'EventBanner',
  nullable: false,
  resolve: async (_, __, ctx) => {
    try {
      let eventBannersId, eventBanner, eventId, bannerImage, order;
      try {
        eventBannersId = await ctx.prisma.setting.findOne({
          where: { id: 1 },
          select: { mainEventBannerId: true },
        });

        if (eventBannersId) {
          for (let i = 0; i < eventBannersId.mainEventBannerId.length; i++) {
            eventBanner = await ctx.prisma.event.findOne({
              where: { id: eventBannersId.mainEventBannerId[i] },
              select: { id: true, bannerImage: true },
            });

            eventId = eventBanner?.id;
            bannerImage = eventBanner?.bannerImage;
            order = i;

            return { eventId, bannerImage, order };
          }
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
