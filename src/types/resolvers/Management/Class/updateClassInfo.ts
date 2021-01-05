import { arg, intArg, mutationField, stringArg } from "@nexus/schema";

export const updateClassInfo = mutationField("updateClassInfo", {
  type: "Boolean",
  args: {
    classId: intArg({ required: true }),
    className: stringArg({ nullable: true }),
    classCategory: arg({ type: "Category", nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const { classId, className, classCategory } = args;

      let lang, classUpdate, tagUpdate;
      if (!lang) lang = "VI";

      if (className) {
        let originalClass = await ctx.prisma.class.findOne({
          where: { id: classId },
          select: {
            names: { where: { lang }, select: { id: true } },
            tags: {
              where: { isClass: true },
              select: {
                id: true,
                names: { where: { lang }, select: { id: true } },
              },
            },
          },
        });
        if (!originalClass) return false;

        classUpdate = await ctx.prisma.class.update({
          where: { id: classId },
          data: {
            names: {
              delete: { id: originalClass.names[0].id },
              create: {
                lang,
                word: className,
                searchWord: className.toLowerCase(),
              },
            },
          },
        });

        if (!classUpdate) return false;

        if (originalClass.tags.length > 0) {
          tagUpdate = await ctx.prisma.tag.update({
            where: { id: originalClass.tags[0].id },
            data: {
              names: {
                delete: { id: originalClass.tags[0].names[0].id },
                create: {
                  lang,
                  word: className,
                  searchWord: className.toLowerCase(),
                },
              },
            },
          });
          if (!tagUpdate) return false;
        }
      }

      if (classCategory) {
        classUpdate = await ctx.prisma.class.update({
          where: { id: classId },
          data: { category: classCategory },
        });
        if (!classUpdate) return false;

        let tagNum = await ctx.prisma.tag.findMany({
          where: { classId },
        });

        if (tagNum.length > 0) {
          tagUpdate = await ctx.prisma.tag.updateMany({
            where: { classId },
            data: { category: classCategory },
          });
          if (!tagUpdate) return false;
        }
      }

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
