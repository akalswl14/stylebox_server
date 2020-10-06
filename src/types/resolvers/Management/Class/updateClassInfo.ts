import { arg, intArg, mutationField, stringArg } from '@nexus/schema';

export const updateClassInfo = mutationField('updateClassInfo', {
  type: 'Boolean',
  args: {
    classId: intArg({ required: true }),
    className: stringArg({ nullable: true }),
    classCategory: arg({ type: 'Category', nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { classId, className, classCategory } = args;

      let lang, classUpdate, tagUpdate;
      if (!lang) lang = 'VI';

      if (className) {
        let originalClass = await ctx.prisma.class.findOne({
          where: { id: classId },
          select: {
            names: { where: { lang }, select: { word: true } },
            tags: { where: { isClass: true }, select: { id: true } },
          },
        });
        if (!originalClass) return null;

        classUpdate = await ctx.prisma.class.update({
          where: { id: classId },
          data: {
            names: {
              delete: { word: originalClass.names[0].word },
              create: { lang, word: className },
            },
          },
        });

        tagUpdate = await ctx.prisma.tag.update({
          where: { id: originalClass.tags[0].id },
          data: {
            names: {
              delete: { word: originalClass.names[0].word },
              create: { lang, word: className },
            },
          },
        });
        if (!tagUpdate || !classUpdate) return false;
      }

      if (classCategory) {
        classUpdate = await ctx.prisma.class.update({
          where: { id: classId },
          data: { category: classCategory },
        });

        tagUpdate = await ctx.prisma.tag.updateMany({
          where: { classId },
          data: { category: classCategory },
        });
        if (!tagUpdate || !classUpdate) return false;
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
