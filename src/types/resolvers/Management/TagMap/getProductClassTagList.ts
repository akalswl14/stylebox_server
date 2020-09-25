import { queryField } from '@nexus/schema';

export const getProductClassTagList = queryField('getProductClassTagList', {
  type: 'TagMapList',
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tags = [],
        tagList = [],
        lang,
        productClasses,
        productTags;

      if (!lang) lang = 'VI';

      productClasses = await ctx.prisma.class.findMany({
        where: { category: 'ProductClass' },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const productClass of productClasses) {
        productTags = await ctx.prisma.tag.findMany({
          where: { category: 'ProductClass', classId: productClass.id },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });

        for (const productTag of productTags) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: productTag.id } } },
          });

          tags.push({
            tagId: productTag.id,
            tagName: productTag.names[0].word,
            postNum,
          });
        }

        tagList.push({
          className: productClass.names[0].word,
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
