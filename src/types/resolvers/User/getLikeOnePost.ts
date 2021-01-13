import { queryField, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getLikeOnePost = queryField("getLikeOnePost", {
  type: "Boolean",
  args: {
    postId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { postId } = args;
      const userId = Number(getUserId(ctx));
      if (!userId) return null;
      const likeNum = await ctx.prisma.like.count({
        where: {
          userId,
          postId,
        },
      });
      return likeNum > 0 ? true : false;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
