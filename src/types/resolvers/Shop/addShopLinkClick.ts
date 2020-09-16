import { intArg, mutationField } from "@nexus/schema";

export const addShopLinkClick = mutationField("addShopLinkClick", {
  type: "Boolean",
  args: {
    id: intArg({ required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let externalLinkClickNum, queryResult, result;
      try {
        queryResult = await ctx.prisma.shop.findOne({
          where: { id },
          select: { externalLinkClickNum: true },
        });
        externalLinkClickNum = queryResult ? externalLinkClickNum : 0;
        externalLinkClickNum++;
        result = await ctx.prisma.shop.update({
          where: { id },
          data: {
            externalLinkClickNum,
          },
        });
      } catch (e) {
        console.log(e);
      }
      return result ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
