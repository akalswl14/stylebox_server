import { intArg, queryField } from '@nexus/schema';

export const getTagInfo = queryField('getTagInfo', {
  type: 'TagInfo',
  args: { id: intArg({ required: true }) },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let lang;
      if (!lang) lang = 'VI';

      let tagResult = await ctx.prisma.tag.findOne({
        where: { id },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          category: true,
          classId: true,
          Class: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
          createdAt: true,
          updatedAt: true,
          tagImage: true,
        },
      });

      let postNum = await ctx.prisma.post.count({
        where: { tags: { some: { id } } },
      });

      let shopNum = await ctx.prisma.shop.count({
        where: { tags: { some: { id } } },
      });

      let productNum = await ctx.prisma.product.count({
        where: { tags: { some: { id } } },
      });

      let tagInfo = {
        tagId: tagResult?.id,
        tagName: tagResult?.names[0].word,
        category: tagResult?.category,
        tagImage: tagResult?.tagImage,
        className: tagResult?.Class.names[0].word,
        classId: tagResult?.classId,
        postNum,
        shopNum,
        productNum,
        createdAt: tagResult?.createdAt,
        updatedAt: tagResult?.updatedAt,
      };

      return tagInfo ? tagInfo : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
