import { arg, mutationField } from "@nexus/schema";

export const updateSettingEventBanner = mutationField(
  "updateSettingEventBanner",
  {
    type: "Boolean",
    args: {
      events: arg({ type: "IdOrderInputType", list: true }),
    },
    nullable: false,
    list: true,
    resolve: async (_, args, ctx) => {
      try {
        const { events } = args;
        let num = 0,
          rtnBanners = [];
        while (events.length != rtnBanners.length) {
          for (const eachEvent of events) {
            if (num == eachEvent.order) {
              rtnBanners.push(eachEvent.id);
            }
          }
          num++;
        }
        let queryResult = await ctx.prisma.setting.update({
          where: {
            id: 1,
          },
          data: {
            mainEventBannerId: { set: rtnBanners },
          },
        });
        return queryResult ? true : false;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  }
);
