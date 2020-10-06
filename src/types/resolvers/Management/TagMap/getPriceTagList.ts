import { queryField } from '@nexus/schema';

export const getPriceTagList = queryField('getPriceTagList', {
  type: 'TagMapInfo',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tags = [],
        lang;

      if (!lang) lang = 'VI';

      let priceTags = await ctx.prisma.tag.findMany({
        where: { category: 'Price' },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const priceTag of priceTags) {
        let postNum = await ctx.prisma.post.count({
          where: { tags: { some: { id: priceTag.id } } },
        });

        tags.push({
          tagId: priceTag.id,
          tagName: priceTag.names[0].word,
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
