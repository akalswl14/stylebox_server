import { intArg, mutationField } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const toggleLikePost = mutationField("toggleLikePost", {
  type: "Boolean",
  args: {
    id: intArg({ required: true }),
  },
  nullable: false,
  description: "id argument is for Post ID.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      const userId = Number(getUserId(ctx));
      let likeNum,
        result,
        userExists = false;
      try {
        likeNum = await ctx.prisma.like.count({
          where: {
            userId,
            postId: id,
          },
        });
        userExists = likeNum > 0 ? true : false;
        if (userExists) {
          result = await ctx.prisma.like.deleteMany({
            where: {
              userId,
              postId: id,
            },
          });
        } else {
          result = await ctx.prisma.like.create({
            data: {
              User: { connect: { id: userId } },
              Post: { connect: { id } },
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
