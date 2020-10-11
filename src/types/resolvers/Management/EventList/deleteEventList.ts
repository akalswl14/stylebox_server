import { intArg, mutationField } from '@nexus/schema';

export const deleteEventList = mutationField('deleteEventList', {
  type: 'Boolean',
  args: {
    eventIds: intArg({ required: true, list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { eventIds = [] } = args;
      let deleteQuery;

      deleteQuery = await ctx.prisma.eventContentsImage.deleteMany({
        where: { eventId: { in: eventIds } },
      });
      deleteQuery = await ctx.prisma.eventImage.deleteMany({
        where: { eventId: { in: eventIds } },
      });
      deleteQuery = await ctx.prisma.eventVideo.deleteMany({
        where: { eventId: { in: eventIds } },
      });
      deleteQuery = await ctx.prisma.like.deleteMany({
        where: { eventId: { in: eventIds } },
      });
      deleteQuery = await ctx.prisma.view.deleteMany({
        where: { eventId: { in: eventIds } },
      });
      let queryResult = await ctx.prisma.event.deleteMany({
        where: { id: { in: eventIds } },
      });

      if (!deleteQuery || !queryResult) return false;

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
