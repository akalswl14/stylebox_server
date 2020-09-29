import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from '@nexus/schema';

export const updateTagInfo = mutationField('updateTagInfo', {
  type: 'Boolean',
  args: {
    tagId: intArg({ required: true }),
    tagName: stringArg({ nullable: true }),
    tagCategory: arg({ type: 'Category', nullable: true }),
    tagImage: stringArg({ nullable: true }),
    isTagImageChange: booleanArg({ required: true }),
    classId: intArg({ nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        tagId,
        tagName,
        tagCategory,
        tagImage,
        isTagImageChange,
        classId,
      } = args;

      let lang;
      if (!lang) lang = 'VI';

      if (tagName) {
        let originalTag = await ctx.prisma.tag.findOne({
          where: { id: tagId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (!originalTag) return null;
        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: {
            names: {
              delete: { word: originalTag.names[0].word },
              create: { lang, word: tagName },
            },
          },
        });
      }

      if (isTagImageChange) {
        await ctx.prisma.tag.update({
          where: { id: tagId },
          data: { tagImage },
        });
      }

      if (!tagCategory) {
        if (classId) {
          let originalClassId = await ctx.prisma.tag.findOne({
            where: { id: tagId },
            select: { classId: true },
          });
          if (!originalClassId) return null;
          let deleteClassId = await ctx.prisma.class.update({
            where: { id: originalClassId.classId },
            data: { tags: { disconnect: { id: tagId } } },
          });
          if (!deleteClassId) return null;
          let connectNewTag = await ctx.prisma.tag.update({
            where: { id: tagId },
            data: {
              Class: { connect: { id: classId } },
            },
          });
          if (!connectNewTag) return null;
        }
      } else {
        let originalClassId = await ctx.prisma.tag.findOne({
          where: { id: tagId },
          select: { classId: true },
        });
        if (!originalClassId) return null;
        let deleteClassId = await ctx.prisma.class.update({
          where: { id: originalClassId.classId },
          data: { tags: { disconnect: { id: tagId } } },
        });
        if (!deleteClassId) return null;
        let connectNewTag = await ctx.prisma.tag.update({
          where: { id: tagId },
          data: {
            category: tagCategory,
            Class: { connect: { id: classId } },
          },
        });
        if (!connectNewTag) return null;
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
