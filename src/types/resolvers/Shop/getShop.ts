import { intArg, queryField } from "@nexus/schema";

export const getShop = queryField("getShop", {
  type: "Shop",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  description: "id argument is for Shop ID.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let shop;
      shop = await ctx.prisma.shop.findOne({
        where: { id },
      });
      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
