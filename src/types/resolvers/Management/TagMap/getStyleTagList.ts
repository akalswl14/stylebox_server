import { queryField } from '@nexus/schema';

export const getStyleTagList = queryField('getStyleTagList', {
  type: 'TagMapInfo',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tags = [],
        lang;

      if (!lang) lang = 'VI';

      let styleTags = await ctx.prisma.tag.findMany({
        where: { category: 'Style' },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const styleTag of styleTags) {
        let postNum = await ctx.prisma.post.count({
          where: { tags: { some: { id: styleTag.id } } },
        });

        tags.push({
          tagId: styleTag.id,
          tagName: styleTag.names[0].word,
          postNum,
        });
      }

      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
