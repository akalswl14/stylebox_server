import { booleanArg, intArg, queryField, stringArg } from "@nexus/schema";

export const getEventManageList = queryField("getEventManageList", {
  type: "EventManagementListThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    eventId: intArg({ nullable: true }),
    eventTitle: stringArg({ nullable: true }),
    eventIdAsc: booleanArg({ nullable: true }),
    eventTitleAsc: booleanArg({ nullable: true }),
    eventStartAsc: booleanArg({ nullable: true }),
    eventEndAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        eventId,
        eventTitle,
        eventIdAsc,
        eventTitleAsc,
        eventStartAsc,
        eventEndAsc,
      } = args;

      let { pageNum } = args;

      if (!pageNum) pageNum = 1;

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let events = [];

      let whereOption = {},
        orderByOption = {};

      if (eventId) {
        whereOption = { id: eventId };
      }
      if (eventTitle) {
        whereOption = {
          searchTitle: { contains: eventTitle.toLowerCase() },
        };
      }
      if (typeof eventIdAsc === "boolean") {
        orderByOption = eventIdAsc ? { id: "asc" } : { id: "desc" };
      } else if (typeof eventTitleAsc === "boolean") {
        orderByOption = eventTitleAsc ? { title: "asc" } : { title: "desc" };
      } else if (typeof eventStartAsc === "boolean") {
        orderByOption = eventStartAsc
          ? { startDate: "asc" }
          : { startDate: "desc" };
      } else if (typeof eventEndAsc === "boolean") {
        orderByOption = eventEndAsc ? { dueDate: "asc" } : { dueDate: "desc" };
      } else {
        orderByOption = [
          { id: "asc" },
          { title: "asc" },
          { startDate: "asc" },
          { dueDate: "asc" },
        ];
      }

      let eventResult = await ctx.prisma.event.findMany({
        where: whereOption,
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
        select: {
          id: true,
          title: true,
          startDate: true,
          dueDate: true,
          isOnList: true,
          url: true,
        },
      });

      for (const event of eventResult) {
        let viewsNum = await ctx.prisma.view.count({
          where: { eventId: event.id },
        });
        let likesNum = await ctx.prisma.like.count({
          where: { eventId: event.id },
        });

        events.push({
          eventId: event.id,
          eventTitle: event.title,
          eventStart: event.startDate,
          eventEnd: event.dueDate,
          isOnList: event.isOnList,
          link: event.url,
          likesNum,
          viewsNum,
        });
      }

      let totalEventNum = await ctx.prisma.event.count({
        where: whereOption,
      });

      return { totalEventNum, events };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
