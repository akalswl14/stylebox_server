import { arg, intArg, mutationField, stringArg } from '@nexus/schema';

export const createTagInfo = mutationField('createTagInfo', {
  type: 'Boolean',
  args: {
    tagName: stringArg({ required: true }),
    tagCategory: arg({ type: 'Category', required: true }),
    tagImage: stringArg({ nullable: true }),
    classId: intArg({ required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagName, tagCategory, tagImage, classId } = args;
      let lang;
      if (!lang) lang = 'VI';

      let queryResult = await ctx.prisma.tag.create({
        data: {
          category: tagCategory,
          tagImage,
          isClass: false,
          isRecommendation: 0,
          Class: { connect: { id: classId } },
          names: { create: { lang, word: tagName } },
        },
      });

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
