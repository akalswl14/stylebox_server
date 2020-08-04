import { intArg, queryField } from "@nexus/schema";

export const getEvent = queryField("getEvent", {
  type: "Event",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let event;
      try {
        if (id) {
          event = await ctx.prisma.event.findOne({
            where: { id },
          });
        }
      } catch (e) {
        console.log(e);
      }
      if (event) {
        return event;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
