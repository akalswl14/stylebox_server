import { queryField, stringArg } from "@nexus/schema";

export const getLocationTags = queryField("getLocationTags", {
  type: "LocationTagInfo",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const lang = args.lang ?? "VI";
      let tags = [];
      let tagIds: number[] = [14, 1, 33, 35];
      for (const eachTagId of tagIds) {
        let tagInfoResult = await ctx.prisma.tagName.findMany({
          where: {
            lang,
            Tag: { id: eachTagId },
          },
          select: {
            word: true,
            tagId: true,
            Tag: { select: { isClass: true } },
          },
        });
        if (!tagInfoResult) return null;
        if (tagInfoResult[0].tagId) {
          tags.push({
            id: tagInfoResult[0].tagId,
            tagName:
              tagInfoResult[0].tagId === 35 ? "OTHERS" : tagInfoResult[0].word,
          });
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
