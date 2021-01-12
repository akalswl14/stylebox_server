import { queryField, stringArg } from "@nexus/schema";

export const getLocationOption = queryField("getLocationOption", {
  type: "levelLocationOption",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const lang = args.lang ?? "VI";
      let tagIds: number[] = [14, 1, 33, 35];
      let options = [];

      for (const eachTagId of tagIds) {
        let subTags = [];
        let order = 1;
        let tagInfoResult = await ctx.prisma.tagName.findMany({
          where: {
            lang,
            Tag: { id: eachTagId },
          },
          select: {
            word: true,
            Tag: { select: { classId: true } },
          },
        });
        if (!tagInfoResult) return null;

        let subTagInfoResults = await ctx.prisma.tagName.findMany({
          where: {
            Tag: { classId: tagInfoResult[0].Tag?.classId },
          },
          select: {
            tagId: true,
            word: true,
            Tag: { select: { isClass: true } },
          },
          orderBy: { word: "asc" },
        });

        if (!subTagInfoResults) return null;

        for (const eachTag of subTagInfoResults) {
          if (eachTag.tagId) {
            let postNum = await ctx.prisma.post.count({
              where: { tags: { some: { id: eachTag.tagId } } },
            });
            if (postNum > 0) {
              subTags.push({
                id: eachTag.tagId,
                tagName: eachTag.word,
                order: order++,
                isClass: eachTag.Tag?.isClass,
              });
            }
          }
        }
        options.push({
          classId: tagInfoResult[0].Tag?.classId,
          className: eachTagId === 35 ? "OTHERS" : tagInfoResult[0].word,
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
