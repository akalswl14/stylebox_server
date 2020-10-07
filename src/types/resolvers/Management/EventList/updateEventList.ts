import { arg, mutationField } from '@nexus/schema';

export const updateEventList = mutationField('updateEventList', {
  type: 'Boolean',
  args: {
    events: arg({ type: 'EventListInputType', list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { events = [] } = args;
      for (const event of events) {
        await ctx.prisma.event.update({
          where: { id: event.eventId },
          data: {
            startDate: { set: event.eventStart },
            dueDate: { set: event.eventEnd },
          },
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
