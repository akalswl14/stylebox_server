import { intArg, mutationField } from "@nexus/schema";

export const deleteUsers = mutationField("deleteUsers", {
  type: "Boolean",
  args: {
    userIds: intArg({ list: [true] }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const userIds = args.userIds ?? [];
      let likeResult = await ctx.prisma.like.deleteMany({
        where: { userId: { in: userIds } },
      });
      let viewResult = await ctx.prisma.view.deleteMany({
        where: { userId: { in: userIds } },
      });
      let tagResult = await ctx.prisma.searchTagLog.deleteMany({
        where: { userId: { in: userIds } },
      });
      let queryResult = await ctx.prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
      return queryResult && likeResult && viewResult && tagResult
        ? true
        : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
