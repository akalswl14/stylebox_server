import { intArg, mutationField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const toggleWishShop = mutationField("toggleWishShop", {
  type: "Boolean",
  args: {
    id: intArg({ required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      const userId = Number(getUserId(ctx));
      let user,
        shop,
        wishers,
        wishersCnt = 0,
        userExists = false;
      try {
        user = await ctx.prisma.user.findOne({ where: { id: userId } });
      } catch (e) {
        console.log(e);
      }
      try {
        if (id) {
          shop = await ctx.prisma.shop.findOne({
            where: { id },
            include: { wishers: true },
          });
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
      if (shop) {
        wishers = shop.wishers;
        if (shop.wishersCnt) {
          wishersCnt = shop.wishersCnt;
        }
        wishers.forEach((eachUser: { id: number }) => {
          if (eachUser.id == userId) {
            userExists = true;
          }
        });
        if (userExists) {
          await ctx.prisma.shop.update({
            where: { id },
            data: {
              wishers: {
                disconnect: [{ id: userId }],
              },
              wishersCnt: wishersCnt - 1,
            },
          });
        } else {
          await ctx.prisma.shop.update({
            where: { id },
            data: {
              wishers: {
                connect: [{ id: userId }],
              },
              wishersCnt: wishersCnt + 1,
            },
          });
        }
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
