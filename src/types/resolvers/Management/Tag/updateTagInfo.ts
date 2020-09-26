import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from '@nexus/schema';

export const updateTagInfo = mutationField('updateTagInfo', {
  type: 'Boolean',
  args: {
    tagId: intArg({ required: true }),
    tagName: stringArg({ nullable: true }),
    tagCategory: arg({ type: 'Category', nullable: true }),
    tagImage: stringArg({ nullable: true }),
    isTagImageChange: booleanArg({ required: true }),
    classId: intArg({ nullable: true }),
  },
  nullable: false,
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

      let lang;
      if (!lang) lang = 'VI';

      if (tagName) {
        let originalTagName = await ctx.prisma.class.findOne({
          where: { id: classId },
          select: { names: { where: { lang }, select: { word: true } } },
        });

        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: {
            names: {
              delete: { word: originalTagName?.names[0].word },
              create: { lang, word: tagName },
            },
          },
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
