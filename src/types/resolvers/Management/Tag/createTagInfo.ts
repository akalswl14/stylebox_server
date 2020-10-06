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
      let lang,
        isClass = false;
      if (!lang) lang = 'VI';

      if (
        tagCategory === 'Style' ||
        tagCategory === 'Feature' ||
        tagCategory === 'Price'
      ) {
        isClass = true;
      } else {
        let classNameResult = await ctx.prisma.class.findMany({
          where: { id: classId, category: tagCategory },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (!classNameResult) return null;
        if (classNameResult[0].names[0].word === tagName) {
          isClass = true;
        }
      }

      let queryResult = await ctx.prisma.tag.create({
        data: {
          category: tagCategory,
          tagImage,
          isClass,
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
