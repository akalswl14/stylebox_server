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
      let classResult,
        options = [];
      classResult = await ctx.prisma.class.findMany({
        where: { category: "ProductClass" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          tags: {
            select: {
              id: true,
              names: { where: { lang }, select: { word: true } },
              isClass: true,
            },
          },
        },
      });
      if (!classResult) return null;
      for (const eachClass of classResult) {
        let subTags = [];
        for (const eachTag of eachClass.tags) {
          subTags.push({
            id: eachTag.id,
            tagName: eachTag.names[0].word,
            isClass: eachTag.isClass,
          });
        }
        options.push({
          classId: eachClass.id,
          className: eachClass.names[0].word,
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
