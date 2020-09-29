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

      let lang;
      if (!lang) lang = 'VI';

      if (className) {
        let originalClassName = await ctx.prisma.class.findOne({
          where: { id: classId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (!originalClassName) return null;
        await ctx.prisma.class.update({
          where: { id: classId },
          data: {
            names: {
              delete: { word: originalClassName.names[0].word },
              create: { lang, word: className },
            },
          },
        });
      }

      if (classCategory) {
        await ctx.prisma.class.update({
          where: { id: classId },
          data: { category: classCategory },
        });

        await ctx.prisma.tag.updateMany({
          where: { classId },
          data: { category: classCategory },
        });
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
