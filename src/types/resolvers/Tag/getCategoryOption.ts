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
      const lang = args.lang ?? "VI";
      let options = [];
      let classNameResult = await ctx.prisma.className.findMany({
        where: { lang, Class: { category: "ProductClass" } },
        select: {
          word: true,
          classId: true,
        },
        orderBy: { word: "asc" },
      });
      if (!classNameResult) return null;
      for (const eachclassName of classNameResult) {
        if (eachclassName.classId) {
          let tagResult = await ctx.prisma.tagName.findMany({
            where: { lang, Tag: { classId: eachclassName.classId } },
            select: {
              tagId: true,
              word: true,
              Tag: { select: { isClass: true } },
            },
            orderBy: { word: "asc" },
          });
          let subTags = [];
          let order = 1;
          for (const eachtagName of tagResult) {
            if (!eachtagName.Tag) continue;
            if (eachtagName.tagId) {
              let postNum = await ctx.prisma.post.count({
                where: { tags: { some: { id: eachtagName.tagId } } },
              });
              if (postNum > 0) {
                subTags.push({
                  id: eachtagName.tagId,
                  tagName: eachtagName.word,
                  isClass: eachtagName.Tag.isClass,
                  order: eachtagName.Tag.isClass ? 0 : order,
                });
                if (!eachtagName.Tag.isClass) order++;
              }
            }
          }
          if (subTags.length > 0) {
            options.push({
              classId: eachclassName.classId,
              className: eachclassName.word,
              subTags,
            });
          }
        }
      }
      return options ? options : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
