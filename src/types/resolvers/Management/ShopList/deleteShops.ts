import { intArg, mutationField } from "@nexus/schema";

export const deleteShops = mutationField("deleteShops", {
  type: "Boolean",
  args: {
    shopIds: intArg({ list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { shopIds = [] } = args;
      let queryResult = await ctx.prisma.shop.deleteMany({
        where: { id: { in: shopIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
