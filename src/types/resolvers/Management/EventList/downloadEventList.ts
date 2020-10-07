import { queryField } from '@nexus/schema';

export const downloadEventList = queryField('downloadEventList', {
  type: 'EventManagementList',
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let events = [];

      let eventResult = await ctx.prisma.event.findMany({
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

      return events ? events : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
