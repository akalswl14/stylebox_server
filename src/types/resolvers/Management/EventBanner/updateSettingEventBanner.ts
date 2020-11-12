import { arg, mutationField } from "@nexus/schema";

export const updateSettingEventBanner = mutationField(
  "updateSettingEventBanner",
  {
    type: "Boolean",
    args: {
      events: arg({ type: "IdOrderInputType", list: [true], required: true }),
    },
    nullable: false,
    resolve: async (_, args, ctx) => {
      try {
        const { events } = args;
        let rtnBanners: number[] = [];
        for (const eachEvent of events) {
          if (eachEvent.id) {
            rtnBanners.push(eachEvent.id);
          }
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
