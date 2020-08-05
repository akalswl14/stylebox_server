import { intArg, mutationField } from "@nexus/schema";

export const deleteShop = mutationField("deleteShop", {
  type: "Shop",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let shop;
      try {
        shop = await ctx.prisma.shop.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      console.log(shop);
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
