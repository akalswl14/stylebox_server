import { intArg, mutationField } from "@nexus/schema";

export const deleteEventList = mutationField("deleteEventList", {
  type: "Boolean",
  args: {
    eventIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { eventIds = [] } = args;
      let queryResult = await ctx.prisma.event.deleteMany({
        where: { id: { in: eventIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
