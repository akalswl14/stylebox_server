import { intArg, queryField } from '@nexus/schema';

export const getPostDesciption = queryField('getPostDescription', {
  type: 'String',
  args: { id: intArg({ required: true }) },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;

      let description = await ctx.prisma.post.findOne({
        where: { id },
        select: { text: true },
      });

      return description ? description.text : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
