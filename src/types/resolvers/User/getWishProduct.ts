import { queryField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getWishProduct = queryField("getWishProduct", {
  type: "Product",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      let user;
      try {
        user = await ctx.prisma.user.findOne({
          where: { id: userId },
          include: { wishProducts: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (user) {
        let products = user.wishProducts;
        return products;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
