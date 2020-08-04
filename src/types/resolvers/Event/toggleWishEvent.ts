import { intArg, mutationField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const toggleWishEvent = mutationField("toggleWishEvent", {
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
        event,
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
          event = await ctx.prisma.event.findOne({
            where: { id },
            include: { wishers: true },
          });
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
      if (event) {
        wishers = event.wishers;
        if (event.wishersCnt) {
          wishersCnt = event.wishersCnt;
        }
        wishers.forEach((eachUser: { id: number }) => {
          if (eachUser.id == userId) {
            userExists = true;
          }
        });
        if (userExists) {
          await ctx.prisma.event.update({
            where: { id },
            data: {
              wishers: {
                disconnect: [{ id: userId }],
              },
              wishersCnt: wishersCnt - 1,
            },
          });
        } else {
          await ctx.prisma.event.update({
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
