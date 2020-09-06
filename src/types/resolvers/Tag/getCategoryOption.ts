import { queryField, stringArg } from "@nexus/schema";

export const getCategoryOption = queryField("getCategoryOption", {
  type: "levelCategoryOption",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG" } = args;
      let options = [];
      let classNameResult = await ctx.prisma.className.findMany({
        where: { lang, Class: { is: { category: "ProductClass" } } },
        select: {
          word: true,
          classId: true,
        },
        orderBy: { word: "asc" },
      });
      if (!classNameResult) return null;
      for (const eachclassName of classNameResult) {
        let tagResult = await ctx.prisma.tagName.findMany({
          where: { lang, Tag: { is: { classId: eachclassName.classId } } },
          select: {
            tagId: true,
            word: true,
            Tag: { select: { isClass: true } },
          },
          orderBy: { word: "asc" },
        });
        let subTags = [];
        for (const eachtagName of tagResult) {
          subTags.push({
            id: eachtagName.tagId,
            tagName: eachtagName.word,
            isClass: eachtagName.Tag.isClass,
          });
        }
        options.push({
          classId: eachclassName.classId,
          className: eachclassName.word,
          subTags,
        });
      }
      return options ? options : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
