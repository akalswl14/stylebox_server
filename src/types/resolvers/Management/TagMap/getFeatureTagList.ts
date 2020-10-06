import { queryField } from '@nexus/schema';

export const getFeatureTagList = queryField('getFeatureTagList', {
  type: 'TagMapInfo',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tags = [],
        lang;

      if (!lang) lang = 'VI';

      let featureTags = await ctx.prisma.tag.findMany({
        where: { category: 'Feature' },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const featureTag of featureTags) {
        let postNum = await ctx.prisma.post.count({
          where: { tags: { some: { id: featureTag.id } } },
        });

        tags.push({
          tagId: featureTag.id,
          tagName: featureTag.names[0].word,
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
