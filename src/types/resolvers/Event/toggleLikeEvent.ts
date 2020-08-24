import { intArg, mutationField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const toggleLikeEvent = mutationField("toggleLikeEvent", {
  type: "Boolean",
  args: {
    id: intArg({ required: true }),
  },
  nullable: false,
  description: "id argument is for Event ID.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      const userId = Number(getUserId(ctx));
      let user,
        event,
        likeList,
        result,
        preferrersCnt = 0,
        userExists = false;
      try {
        user = await ctx.prisma.user.findOne({ where: { id: userId } });
        event = await ctx.prisma.event.findOne({
          where: { id },
          select: { preferrers: true },
        });
      } catch (e) {
        console.log(e);
      }
      try {
        if (user && event) {
          likeList = await ctx.prisma.like.findMany({
            where: {
              userId,
              eventId: id,
            },
          });
          preferrersCnt = event.preferrers.length;
          userExists = preferrersCnt > 0 ? true : false;
          if (userExists) {
            const likeId = likeList[0].id;
            result = await ctx.prisma.like.delete({
              where: {
                id: likeId,
              },
            });
          } else {
            preferrersCnt += 1;
            result = await ctx.prisma.like.create({
              data: {
                User: { connect: { id: userId } },
                Event: { connect: { id } },
              },
            });
          }
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
      }
      return result ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
