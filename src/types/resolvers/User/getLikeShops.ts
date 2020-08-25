import { queryField, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getLikeShops = queryField("getLikeShops", {
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
      const userId = Number(getUserId(ctx));
      let result;
      const take = 4;
      const skip = 1;
      try {
        if (id) {
          result = await ctx.prisma.shop.findMany({
            where: {
              preferrers: {
                some: {
                  userId,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
          });
        } else {
          result = await ctx.prisma.shop.findMany({
            where: {
              preferrers: {
                some: {
                  userId,
                },
              },
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
      return result ? result : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
