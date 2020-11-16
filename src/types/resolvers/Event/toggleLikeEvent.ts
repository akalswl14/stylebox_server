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
      if (!userId) {
        return false;
      }
      let likeNum,
        result,
        userExists = false;
      try {
        likeNum = await ctx.prisma.like.count({
          where: {
            userId,
            eventId: id,
          },
        });
        userExists = likeNum > 0 ? true : false;
        if (userExists) {
          result = await ctx.prisma.like.deleteMany({
            where: {
              userId,
              eventId: id,
            },
          });
        } else {
          result = await ctx.prisma.like.create({
            data: {
              User: { connect: { id: userId } },
              Event: { connect: { id } },
            },
          });
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
