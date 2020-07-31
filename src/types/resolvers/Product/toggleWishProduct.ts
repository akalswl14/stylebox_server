import { intArg, mutationField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const toggleWishProduct = mutationField("toggleWishProduct", {
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
        product,
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
          product = await ctx.prisma.product.findOne({
            where: { id },
            include: { wishers: true },
          });
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
      if (product) {
        wishers = product.wishers;
        if (product.wishersCnt) {
          wishersCnt = product.wishersCnt;
        }
        wishers.forEach((eachUser: { id: number }) => {
          if (eachUser.id == userId) {
            userExists = true;
          }
        });
        if (userExists) {
          await ctx.prisma.product.update({
            where: { id },
            data: {
              wishers: {
                disconnect: [{ id: userId }],
              },
              wishersCnt: wishersCnt - 1,
            },
          });
        } else {
          await ctx.prisma.product.update({
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
