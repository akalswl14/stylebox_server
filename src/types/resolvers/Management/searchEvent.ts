import { queryField, stringArg } from "@nexus/schema";

export const searchEvent = queryField("searchEvent", {
  type: "eventSearchResult",
  args: { eventTitle: stringArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { eventTitle } = args;
      let eventResult = await ctx.prisma.event.findMany({
        where: { title: { contains: eventTitle } },
        select: { id: true, bannerImage: true, title: true },
      });
      return eventResult;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
