import { stringArg, mutationField, arg, intArg, floatArg } from "@nexus/schema";

export const createSetting = mutationField("createSetting", {
  type: "Setting",
  args: {
    mainBubbleTagId: intArg({ required: true, list: [true] }),
    bestBubbleTagId: intArg({ required: true, list: [true] }),
    shopBubbleTagId: intArg({ required: true, list: [true] }),
    loadingPostNum: intArg({ nullable: true }),
    TodaysStylesPeriod: arg({ type: "DateTime", required: true }),
    bestTotalPostNum: intArg({ nullable: true }),
    bestConstA: floatArg({ nullable: true }),
    bestConstB: floatArg({ nullable: true }),
    shopConstA: floatArg({ nullable: true }),
    shopConstB: floatArg({ nullable: true }),
    shopConstC: floatArg({ nullable: true }),
    adminEmail: stringArg({ required: true }),
    adminEmailPW: stringArg({ required: true }),
    mainEventBannerId: intArg({ required: true, list: [true] }),
    QuestionOption: stringArg({ required: true, list: [true] }),
    SearchPeriod: arg({ type: "DateTime", required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        mainBubbleTagId,
        bestBubbleTagId,
        shopBubbleTagId,
        TodaysStylesPeriod,
        adminEmail,
        adminEmailPW,
        mainEventBannerId,
        QuestionOption,
        SearchPeriod,
      } = args;
      const loadingPostNum = args.loadingPostNum ?? 20;
      const bestTotalPostNum = args.bestTotalPostNum ?? 300;
      const bestConstA = args.bestConstA ?? 1.0;
      const bestConstB = args.bestConstB ?? 1.0;
      const shopConstA = args.shopConstA ?? 1.0;
      const shopConstB = args.shopConstB ?? 1.0;
      const shopConstC = args.shopConstC ?? 1.0;
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
