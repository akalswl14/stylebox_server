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
        eventIdAsc = true,
        eventTitleAsc = true,
        eventStartAsc = true,
        eventEndAsc = true,
      } = args;

      let events = [],
        rtn = [];

      let queryOption = {
        where: {},
        orderBy: {},
        select: {
          id: true,
          title: true,
          startDate: true,
          dueDate: true,
          isOnList: true,
          address: true,
          url: true,
        },
      };

      if (eventId) queryOption.where.id = eventId;
      if (eventTitle) queryOption.where.title = eventTitle;
      if (!eventIdAsc) queryOption.orderBy.id = 'desc';
      if (!eventTitleAsc) queryOption.orderBy.title = 'desc';
      if (!eventStartAsc) queryOption.orderBy.startDate = 'desc';
      if (!eventEndAsc) queryOption.orderBy.dueDate = 'desc';

      let eventResult = await ctx.prisma.event.findMany(queryOption);

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
          address: event.address,
          link: event.url,
          likesNum,
          viewsNum,
        });
      }
      let Num = 13;

      for (let i = pageNum * Num - Num; i < pageNum * Num; i++) {
        rtn.push(events[i]);
      }

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
