import { arg, booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const updateTagInfo = queryField('updateTagInfo', {
  type: 'Boolean',
  args: {
    tagId: intArg({ required: true }),
    tagName: stringArg({ nullable: true }),
    tagCategory: arg({ type: 'Category', nullable: true }),
    tagImage: stringArg({ nullable: true }),
    isTagImageChange: booleanArg({ required: true }),
    classId: intArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        tagId,
        tagName,
        tagCategory,
        tagImage,
        isTagImageChange,
        classId,
      } = args;

      if (tagName) {
        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: { names: { update: { data: { word: tagName } } } },
        });
      }

      if (isTagImageChange) {
        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: { tagImage },
        });
      }

      if (!tagCategory) {
        if (classId) {
          await ctx.prisma.tag.update({
            where: { id: tagId },
            data: {
              Class: { connect: { id: classId } },
            },
          });
        }
      } else {
        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: {
            category: tagCategory,
            Class: { connect: { id: classId } },
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
