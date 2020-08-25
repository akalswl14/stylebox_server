import { intArg, mutationField } from "@nexus/schema";

export const deleteShop = mutationField("deleteShop", {
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
      try {
        shop = await ctx.prisma.shop.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      console.log(shop);
      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
