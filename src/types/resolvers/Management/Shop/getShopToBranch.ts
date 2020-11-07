import { intArg, queryField } from "@nexus/schema";

export const getShopToBranch = queryField("getShopToBranch", {
  type: "branchManagementThumbnail",
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          branches: {
            where: { isMain: false },
            orderBy: { createdAt: "asc" },
            select: {
              id: true,
              names: { where: { lang: "VI" }, select: { word: true } },
              phoneNumbers: true,
              address: true,
              googleMapUrl: true,
            },
          },
        },
      });
      let branchList = [];
      if (!queryResult) return null;
      for (const eachBranch of queryResult.branches) {
        branchList.push({
          id: eachBranch.id,
          branchName: eachBranch.names[0].word,
          phoneNumber: eachBranch.phoneNumbers[0],
          address: eachBranch.address,
          googleMapUrl: eachBranch.googleMapUrl,
        });
      }
      return branchList;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
