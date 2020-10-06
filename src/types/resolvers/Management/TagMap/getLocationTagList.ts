import { queryField } from '@nexus/schema';

export const getLocationTagList = queryField('getLocationTagList', {
  type: 'TagMapList',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tagList = [],
        lang;

      if (!lang) lang = 'VI';

      let locationClasses = await ctx.prisma.class.findMany({
        where: { category: 'Location' },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const locationClass of locationClasses) {
        let tags = [];
        let loactionTags = await ctx.prisma.tag.findMany({
          where: { category: 'Location', classId: locationClass.id },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });

        for (const locationTag of loactionTags) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: locationTag.id } } },
          });

          tags.push({
            tagId: locationTag.id,
            tagName: locationTag.names[0].word,
            postNum,
          });
        }

        tagList.push({
          className: locationClass.names[0].word,
          tags,
        });
      }

      return tagList ? tagList : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
