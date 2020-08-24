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
      let user,
        post,
        likeList,
        result,
        preferrersCnt = 0,
        userExists = false;
      try {
        user = await ctx.prisma.user.findOne({ where: { id: userId } });
        post = await ctx.prisma.post.findOne({
          where: { id },
          select: { preferrers: true },
        });
      } catch (e) {
        console.log(e);
      }
      try {
        if (user && post) {
          likeList = await ctx.prisma.like.findMany({
            where: {
              userId,
              postId: id,
            },
          });
          preferrersCnt = post.preferrers.length;
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
                Post: { connect: { id } },
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
