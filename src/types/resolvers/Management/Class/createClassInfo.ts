import { arg, mutationField, stringArg } from '@nexus/schema';

export const createClassInfo = mutationField('createClassInfo', {
  type: 'Boolean',
  args: {
    className: stringArg({ required: true }),
    category: arg({ type: 'Category', required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { className, category } = args;
      let lang;
      if (!lang) lang = 'VI';

      let queryResult = await ctx.prisma.class.create({
        data: {
          names: { create: { lang, word: className } },
          category,
        },
      });

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
