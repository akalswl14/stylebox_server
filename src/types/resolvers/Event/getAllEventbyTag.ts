import { intArg, stringArg, queryField } from "@nexus/schema";

export const getAllEventbyTag = queryField("getAllEventbyTag", {
  type: "Event",
  args: {
    tags: intArg({ list: true, required: true }),
    filter: stringArg({ nullable: true }),
    id: intArg({ nullable: true }),
    pageNum: intArg({ required: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, filter = "NEW", id, pageNum } = args;
      let events: any[] = [],
        beforeNum,
        noWishNum = take,
        tagList: {
          id: number;
        }[] = [];
      beforeNum = (pageNum - 1) * take;
      if (tags) {
        tags.forEach((eachTag) => {
          tagList.push({ id: eachTag });
        });
      }
      if (filter == "RANK") {
        let noWishevents;
        let WishWhere = {
          tags: { some: { OR: tagList } },
          wishersCnt: { gt: 0 },
        };
        let noWishWhere = {
          tags: { some: { OR: tagList } },
          wishersCnt: { equals: 0 },
        };
        let originaleventsNum = await ctx.prisma.event.count({
          where: { tags: { some: { OR: tagList } }, wishersCnt: { gt: 0 } },
        });
        if (id) {
          if (beforeNum <= originaleventsNum) {
            events = await ctx.prisma.event.findMany({
              where: WishWhere,
              orderBy: { wishersCnt: "desc" },
              take: take,
              skip: skip,
              cursor: { id },
            });
            if (beforeNum < originaleventsNum) {
              noWishNum = take - events.length;
            }
            noWishevents = await ctx.prisma.event.findMany({
              where: noWishWhere,
              orderBy: { createdAt: "desc" },
              take: noWishNum,
            });
          } else {
            noWishevents = await ctx.prisma.event.findMany({
              where: noWishWhere,
              orderBy: { createdAt: "desc" },
              take: noWishNum,
              skip: skip,
              cursor: { id },
            });
          }
        } else {
          events = await ctx.prisma.event.findMany({
            where: WishWhere,
            orderBy: { wishersCnt: "desc" },
          });
          noWishNum = take - events.length;
          noWishevents = await ctx.prisma.event.findMany({
            where: noWishWhere,
            orderBy: { createdAt: "desc" },
            take: noWishNum,
          });
        }
        console.log([...events, ...noWishevents]);
        return [...events, ...noWishevents];
      } else {
        // filter == "NEW"
        if (id) {
          events = await ctx.prisma.event.findMany({
            where: { tags: { some: { OR: tagList } } },
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
          });
        } else {
          events = await ctx.prisma.event.findMany({
            where: { tags: { some: { OR: tagList } } },
            orderBy: { createdAt: "desc" },
            take: take,
          });
        }
        return events;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
