import { queryField, intArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getLikeOneShop = queryField("getLikeOneShop", {
  type: "Boolean",
  args: {
    shopId: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopId } = args;
      const userId = Number(getUserId(ctx));
      if (!userId) return null;
      const likeNum = await ctx.prisma.like.count({
        where: {
          userId,
          shopId,
        },
      });
      return likeNum > 0 ? true : false;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
