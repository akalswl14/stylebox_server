import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from "@nexus/schema";

export const updateTagInfo = mutationField("updateTagInfo", {
  type: "Boolean",
  args: {
    tagId: intArg({ required: true }),
    tagName: stringArg({ nullable: true }),
    tagCategory: arg({ type: "Category", nullable: true }),
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
      if (!lang) lang = "VI";

      if (tagName) {
        let originalTag = await ctx.prisma.tag.findOne({
          where: { id: tagId },
          select: { names: { where: { lang }, select: { id: true } } },
        });
        if (!originalTag) return false;
        let tagNameUpdate = await ctx.prisma.tag.update({
          where: { id: tagId },
          data: {
            names: {
              delete: { id: originalTag.names[0].id },
              create: { lang, word: tagName },
            },
          },
        });
        if (!tagNameUpdate) return false;
      }

      if (isTagImageChange) {
        let tagImageUpdate = await ctx.prisma.tag.update({
          where: { id: tagId },
          data: { tagImage },
        });
        if (!tagImageUpdate) return false;
      }

      if (!tagCategory) {
        if (classId) {
          let originalClassId = await ctx.prisma.tag.findOne({
            where: { id: tagId },
            select: { classId: true },
          });
          if (!originalClassId) return false;

          let connectNewTag = await ctx.prisma.tag.update({
            where: { id: tagId },
            data: {
              Class: { connect: { id: classId } },
            },
          });
          if (!connectNewTag) return false;
        }
      } else {
        if (classId) {
          let originalClassId = await ctx.prisma.tag.findOne({
            where: { id: tagId },
            select: { classId: true },
          });
          if (!originalClassId) return false;

          let connectNewTag = await ctx.prisma.tag.update({
            where: { id: tagId },
            data: {
              category: tagCategory,
              Class: { connect: { id: classId } },
            },
          });
          if (!connectNewTag) return false;
        }
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
