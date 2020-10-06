import { queryField } from '@nexus/schema';

export const downloadTagList = queryField('downloadTagList', {
  type: 'TagList',
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let lang,
        tags = [];

      if (!lang) lang = 'VI';

      let tagResult = await ctx.prisma.tag.findMany({
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          category: true,
          Class: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      });

      for (const tag of tagResult) {
        let shopNum = await ctx.prisma.shop.count({
          where: { tags: { some: { id: tag.id } } },
        });
        let postNum = await ctx.prisma.post.count({
          where: { tags: { some: { id: tag.id } } },
        });
        let productNum = await ctx.prisma.product.count({
          where: { tags: { some: { id: tag.id } } },
        });

        tags.push({
          tagId: tag.id,
          tagName: tag.names[0].word,
          category: tag.category,
          className: tag.Class.names[0].word,
          postNum,
          shopNum,
          productNum,
        });
      }

      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
