import { intArg, queryField } from "@nexus/schema";

export const getAllShop = queryField("getAllShop", {
  type: "Shop",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let shops;
      try {
        if (id) {
          shops = await ctx.prisma.shop.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          shops = await ctx.prisma.shop.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
        return shops;
      } catch (e) {
        console.log(e);
      }
      return shops ? shops : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
