import { stringArg, mutationField, arg, intArg, floatArg } from "@nexus/schema";

export const createSetting = mutationField("createSetting", {
  type: "Setting",
  args: {
    mainBubbleTagId: intArg({ required: true, list: true }),
    bestBubbleTagId: intArg({ required: true, list: true }),
    shopBubbleTagId: intArg({ required: true, list: true }),
    loadingPostNum: intArg({ nullable: true }),
    TodaysStylesPeriod: intArg({ nullable: true }),
    bestTotalPostNum: intArg({ nullable: true }),
    bestConstA: floatArg({ nullable: true }),
    bestConstB: floatArg({ nullable: true }),
    shopConstA: floatArg({ nullable: true }),
    shopConstB: floatArg({ nullable: true }),
    shopConstC: floatArg({ nullable: true }),
    shopConstD: floatArg({ nullable: true }),
    adminEmail: stringArg({ required: true }),
    adminEmailPW: stringArg({ required: true }),
    mainEventBannerId: intArg({ required: true, list: true }),
    QuestionOption: stringArg({ required: true, list: true }),
    SearchPeriod: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        mainBubbleTagId,
        bestBubbleTagId,
        shopBubbleTagId,
        loadingPostNum = 20,
        TodaysStylesPeriod = 7,
        bestTotalPostNum = 300,
        bestConstA = 1.0,
        bestConstB = 1.0,
        shopConstA = 1.0,
        shopConstB = 1.0,
        shopConstC = 1.0,
        shopConstD = 1.0,
        adminEmail,
        adminEmailPW,
        mainEventBannerId,
        QuestionOption,
        SearchPeriod = 30,
      } = args;
      let setting;
      try {
        setting = await ctx.prisma.setting.create({
          data: {
            mainBubbleTagId: { set: mainBubbleTagId },
            bestBubbleTagId: { set: bestBubbleTagId },
            shopBubbleTagId: { set: shopBubbleTagId },
            loadingPostNum,
            TodaysStylesPeriod,
            bestTotalPostNum,
            bestConstA,
            bestConstB,
            shopConstA,
            shopConstB,
            shopConstC,
            shopConstD,
            adminEmail,
            adminEmailPW,
            mainEventBannerId: { set: mainEventBannerId },
            QuestionOption: { set: QuestionOption },
            SearchPeriod,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return setting ? setting : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
