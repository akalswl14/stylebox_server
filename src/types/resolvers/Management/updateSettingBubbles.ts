import { arg, mutationField } from "@nexus/schema";

export const updateSettingBubbles = mutationField("updateSettingBubbles", {
  type: "Boolean",
  args: {
    mainBubbleTags: arg({ type: "TagOrderInputType", list: true }),
    bestBubbleTags: arg({ type: "TagOrderInputType", list: true }),
    shopBubbleTags: arg({ type: "TagOrderInputType", list: true }),
  },
  nullable: false,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        mainBubbleTags = [],
        bestBubbleTags = [],
        shopBubbleTags = [],
      } = args;
      let num = 0,
        rtnMainBubbles = [],
        rtnBestBubbles = [],
        rtnShopBubbles = [];
      while (mainBubbleTags.length != rtnMainBubbles.length) {
        for (const eachTag of mainBubbleTags) {
          if (num == eachTag.order) {
            rtnMainBubbles.push(eachTag.tagId);
          }
        }
      }
      while (bestBubbleTags.length != rtnBestBubbles.length) {
        for (const eachTag of bestBubbleTags) {
          if (num == eachTag.order) {
            rtnBestBubbles.push(eachTag.tagId);
          }
        }
      }
      while (shopBubbleTags.length != rtnShopBubbles.length) {
        for (const eachTag of shopBubbleTags) {
          if (num == eachTag.order) {
            rtnShopBubbles.push(eachTag.tagId);
          }
        }
      }
      let queryResult = await ctx.prisma.setting.update({
        where: {
          id: 1,
        },
        data: {
          mainBubbleTagId: { set: rtnMainBubbles },
          bestBubbleTagId: { set: rtnBestBubbles },
          shopBubbleTagId: { set: rtnShopBubbles },
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
