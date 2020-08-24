import { intArg, mutationField } from "@nexus/schema";

export const deleteEvent = mutationField("deleteEvent", {
  type: "Event",
  args: {
    id: intArg({ required: true }),
  },
  nullable: true,
  description: "id argument is for Event ID.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let event;
      try {
        event = await ctx.prisma.event.delete({ where: { id } });
      } catch (e) {
        console.log(e);
      }
      return event ? event : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
