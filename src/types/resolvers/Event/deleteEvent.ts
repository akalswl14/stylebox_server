import { intArg, stringArg, mutationField, arg } from "@nexus/schema";

export const deleteEvent = mutationField("deleteEvent", {
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
        event = await ctx.prisma.event.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      console.log(event);
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
