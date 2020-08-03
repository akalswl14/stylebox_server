import { intArg, queryField } from "@nexus/schema";

export const getShop = queryField("getShop", {
  type: "Shop",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let shop;
      shop = await ctx.prisma.shop.findOne({
        where: { id },
      });
      if (shop) {
        return shop;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
