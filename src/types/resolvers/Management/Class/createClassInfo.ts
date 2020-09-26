import { arg, booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const createClassInfo = queryField('createClassInfo', {
  type: 'Boolean',
  args: {
    className: stringArg({ required: true }),
    category: arg({ type: 'Category', required: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { className, category } = args;
      let lang;
      if (!lang) lang = 'VI';

      await ctx.prisma.class.create({
        data: {
          names: { create: { lang, word: className } },
          category,
        },
      });

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
