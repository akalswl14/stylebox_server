import { intArg, queryField } from "@nexus/schema";

export const getShopBasicInfo = queryField("getShopBasicInfo", {
  type: "ShopBasicInfo",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult;
      queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          names: { where: { lang: "VI" }, select: { word: true } },
          logoUrl: true,
          phoneNumber: true,
          branches: {
            where: { isMain: true },
            select: { address: true, googleMapUrl: true },
          },
        },
      });
      if (!queryResult) return null;
      return {
        id,
        shopName: queryResult.names[0].word,
        logoUrl: queryResult.logoUrl,
        phoneNumber: queryResult.phoneNumber,
        mainBranchAddress: queryResult.branches[0].address,
        mainBranchMapUrl: queryResult.branches[0].googleMapUrl,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
