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
        tagIdAsc,
        tagNameAsc,
        categoryAsc,
      } = args;

      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);

      let lang = 'VI',
        tags = [];

      let orderByOption = {},
        whereOption = {},
        tagOrderByOption = {};

      if (tagId) {
        whereOption = { id: { contains: tagId } };
      }
      if (tagName) {
        whereOption = { names: { some: { word: { contains: tagName } } } };
      }
      if (category) {
        whereOption = { category: { contains: category } };
      }
      if (className) {
        whereOption = {
          Class: { names: { some: { word: { contains: className } } } },
        };
      }
      if (typeof tagIdAsc === 'boolean') {
        orderByOption = tagIdAsc ? { id: 'asc' } : { id: 'desc' };
      } else if (typeof tagNameAsc === 'boolean') {
        tagOrderByOption = tagNameAsc ? { word: 'asc' } : { word: 'desc' };
      } else if (typeof categoryAsc === 'boolean') {
        orderByOption = categoryAsc
          ? { category: 'asc' }
          : { category: 'desc' };
      } else {
        orderByOption = [{ id: 'asc' }, { word: 'asc' }];
        tagOrderByOption = { word: ' asc' };
      }

      let tagResult = await ctx.prisma.tag.findMany({
        where: whereOption,
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
        select: {
          id: true,
          names: {
            where: { lang },
            select: { word: true },
            orderBy: tagOrderByOption,
          },
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

      return tags;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
