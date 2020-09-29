import { intArg, queryField } from '@nexus/schema';

export const getPostTagInfo = queryField('getPostTagInfo', {
  type: 'TagManagementThumbnail',
  args: { id: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { id } = args;
      let lang,
        tags = [],
        order = 0;

      if (!lang) lang = 'VI';

      let tagList = await ctx.prisma.post.findOne({
        where: { id },
        select: { onDetailTagId: true },
      });

      if (!tagList) return null;

      for (const tag of tagList.onDetailTagId) {
        let tagResult = await ctx.prisma.tag.findOne({
          where: { id: tag },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
            category: true,
            classId: true,
            Class: {
              select: { names: { where: { lang }, select: { word: true } } },
            },
          },
        });

        if (!tagResult) return null;

        tags.push({
          tagId: tagResult.id,
          tagName: tagResult.names[0].word,
          classId: tagResult.classId,
          className: tagResult.Class.names[0].word,
          category: tagResult.category,
          order,
        });

        order++;
      }

      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
