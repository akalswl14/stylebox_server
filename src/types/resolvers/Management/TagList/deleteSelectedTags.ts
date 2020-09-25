import { arg, intArg, queryField } from '@nexus/schema';

export const deleteSelectedTags = queryField('deleteSelectedTags', {
  type: 'Boolean',
  args: {
    tags: arg({ type: 'idDicInputType', list: true, required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tags = [] } = args;
      await ctx.prisma.tag.deleteMany({
        where: { OR: tags },
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
