import { arg, mutationField } from "@nexus/schema";

export const updateShops = mutationField("updateShops", {
  type: "Boolean",
  args: {
    shops: arg({ type: "IdValueInputType", list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { shops = [] } = args;
      for (const eachShop of shops) {
        let queryResult = await ctx.prisma.shop.update({
          where: { id: eachShop.id },
          data: {
            priority: eachShop.value,
          },
        });
        if (!queryResult) return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
