import { arg, mutationField } from "@nexus/schema";

export const updateShops = mutationField("updateShops", {
  type: "Boolean",
  args: {
    shops: arg({ type: "IdValueInputType", list: [true], nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const shops = args.shops ?? [];
      for (const eachShop of shops) {
        if (!eachShop.id || (!eachShop.value && eachShop.value !== 0)) continue;
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
