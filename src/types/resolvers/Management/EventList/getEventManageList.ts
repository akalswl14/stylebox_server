import { booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const getEventManageList = queryField('getEventManageList', {
  type: 'EventManagementList',
  args: {
    pageNum: intArg({ nullable: true }),
    eventId: intArg({ nullable: true }),
    eventTitle: stringArg({ nullable: true }),
    eventIdAsc: booleanArg({ nullable: true }),
    eventTitleAsc: booleanArg({ nullable: true }),
    eventStartAsc: booleanArg({ nullable: true }),
    eventEndAsc: booleanArg({ nullable: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        eventId,
        eventTitle,
        eventIdAsc,
        eventTitleAsc,
        eventStartAsc,
        eventEndAsc,
      } = args;

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let events = [];

      let whereOption = {},
        orderByOption = {};

      if (eventId) {
        whereOption = { id: { contains: eventId } };
      }
      if (eventTitle) {
        whereOption = { title: { contains: eventTitle } };
      }
      if (typeof eventIdAsc === 'boolean') {
        orderByOption = eventIdAsc ? { id: 'asc' } : { id: 'desc' };
      } else if (typeof eventTitleAsc === 'boolean') {
        orderByOption = eventTitleAsc ? { title: 'asc' } : { title: 'desc' };
      } else if (typeof eventStartAsc === 'boolean') {
        orderByOption = eventStartAsc
          ? { startDate: 'asc' }
          : { startDate: 'desc' };
      } else if (typeof eventEndAsc === 'boolean') {
        orderByOption = eventEndAsc ? { dueDate: 'asc' } : { dueDate: 'desc' };
      } else {
        orderByOption = {};
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
      return events;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
