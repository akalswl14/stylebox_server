import { intArg, mutationField } from '@nexus/schema';

export const deleteSelectedTags = mutationField('deleteSelectedTags', {
  type: 'Boolean',
  args: {
    tagIds: intArg({ list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagIds = [] } = args;
      let queryResult = await ctx.prisma.tag.deleteMany({
        where: { id: { in: tagIds } },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});