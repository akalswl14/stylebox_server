import { queryField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getWishShop = queryField("getWishShop", {
  type: "Shop",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      let user;
      try {
        user = await ctx.prisma.user.findOne({
          where: { id: userId },
          include: { wishShops: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (user) {
        let shops = user.wishShops;
        return shops;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
