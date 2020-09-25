import { arg, booleanArg, intArg, queryField, stringArg } from '@nexus/schema';

export const getTagList = queryField('getTagList', {
  type: 'TagList',
  args: {
    pageNum: intArg({ nullable: true }),
    tagId: intArg({ nullable: true }),
    tagName: stringArg({ nullable: true }),
    category: arg({ type: 'Category', nullable: true }),
    className: stringArg({ nullable: true }),
    tagIdAsc: booleanArg({ nullable: true }),
    tagNameAsc: booleanArg({ nullable: true }),
    categoryAsc: booleanArg({ nullable: true }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        pageNum = 1,
        tagId,
        tagName,
        category,
        className,
        tagIdAsc = true,
        tagNameAsc = true,
        categoryAsc = true,
      } = args;

      let lang,
        tags = [],
        rtn = [];

      let QueryOption = {
        where: {},
        orderBy: {},
        select: {
          id: true,
          names: { where: { lang }, select: { word: true }, orderBy: {} },
          category: true,
          Class: {
            select: { names: { where: { lang }, select: { word: true } } },
          },
        },
      };

      if (!lang) lang = 'VI';

      if (tagId) QueryOption.where.id = tagId;
      if (tagName) QueryOption.where.names.some.word = tagName;
      if (category) QueryOption.where.category = category;
      if (className) QueryOption.where.Class.names.some.word = className;
      if (!tagIdAsc) QueryOption.orderBy.id = 'desc';
      if (!tagNameAsc) QueryOption.select.names.orderBy.word = 'desc';
      if (!categoryAsc) QueryOption.orderBy.category = 'desc';

      let tagResult = await ctx.prisma.tag.findMany(QueryOption);

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
      let Num = 13;

      for (let i = pageNum * Num - Num; i < pageNum * Num; i++) {
        rtn.push(tags[i]);
      }

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
