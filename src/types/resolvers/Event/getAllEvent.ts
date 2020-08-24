import { intArg, queryField } from "@nexus/schema";

export const getAllEvent = queryField("getAllEvent", {
  type: "Event",
  args: {
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor.",
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let events;
      try {
        if (id) {
          events = await ctx.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
            cursor: { id },
            skip: 1,
          });
        } else {
          events = await ctx.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
            take: 4,
          });
        }
        return events;
      } catch (e) {
        console.log(e);
      }
      return events ? events : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
