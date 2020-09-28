import { intArg, queryField } from "@nexus/schema";

export const getShopDescription = queryField("getShopDescription", {
  type: "String",
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let queryResult = await ctx.prisma.shop.findOne({
        where: { id },
        select: {
          description: true,
        },
      });
      return queryResult?.description;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
