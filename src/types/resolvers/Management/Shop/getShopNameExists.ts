import { mutationField, stringArg } from "@nexus/schema";

export const getShopNameExists = mutationField("getShopNameExists", {
  type: "Boolean",
  args: {
    shopName: stringArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopName } = args;
      let shopNameResult = await ctx.prisma.shopName.count({
        where: { word: { equals: shopName } },
      });
      return shopNameResult > 0 ? true : false;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
