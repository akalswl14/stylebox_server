import { intArg, mutationField } from '@nexus/schema';

export const deleteSelectedTags = mutationField('deleteSelectedTags', {
  type: 'Boolean',
  args: {
    tagIds: intArg({ list: true, required: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { tagIds = [] } = args;
      let deleteQuery;

      deleteQuery = await ctx.prisma.tagName.deleteMany({
        where: { tagId: { in: tagIds } },
      });
      deleteQuery = await ctx.prisma.searchTagLog.deleteMany({
        where: { tagId: { in: tagIds } },
      });

      let shopTagResult = await ctx.prisma.shop.findMany({
        where: { tags: { some: { id: { in: tagIds } } } },
        select: {
          id: true,
          onDetailTagId: true,
        },
      });

      if (shopTagResult) {
        for (const shop of shopTagResult) {
          let saveList = shop.onDetailTagId.slice();
          for (const id of shop.onDetailTagId) {
            if (tagIds.indexOf(id) >= 0) {
              const idx = saveList.indexOf(id);
              if (idx > -1) saveList.splice(idx, 1);
            }
          }
          await ctx.prisma.shop.update({
            where: { id: shop.id },
            data: { onDetailTagId: { set: saveList } },
          });
        }
      }

      let postTagResult = await ctx.prisma.post.findMany({
        where: { tags: { some: { id: { in: tagIds } } } },
        select: {
          id: true,
          onDetailTagId: true,
        },
      });

      if (postTagResult) {
        for (const post of postTagResult) {
          let saveList = post.onDetailTagId.slice();
          for (const id of post.onDetailTagId) {
            if (tagIds.indexOf(id) >= 0) {
              const idx = saveList.indexOf(id);
              if (idx > -1) saveList.splice(idx, 1);
            }
          }
          await ctx.prisma.post.update({
            where: { id: post.id },
            data: { onDetailTagId: { set: saveList } },
          });
        }
      }

      let queryResult = await ctx.prisma.tag.deleteMany({
        where: { id: { in: tagIds } },
      });

      if (!queryResult || !deleteQuery) return false;

      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
