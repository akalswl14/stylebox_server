import { intArg, mutationField } from "@nexus/schema";

export const deleteUsers = mutationField("deleteUsers", {
  type: "Boolean",
  args: {
    userIds: intArg({ list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { userIds = [] } = args;
      let queryResult = await ctx.prisma.user.deleteMany({
        where: { id: { in: userIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
