import { queryField, stringArg } from "@nexus/schema";

export const getFeatureOption = queryField("getFeatureOption", {
  type: "TagThumbnail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG" } = args;
      let nameResult,
        tags = [];
      nameResult = await ctx.prisma.tagName.findMany({
        where: { lang, Tag: { category: "Feature" } },
        select: { word: true, tagId: true },
        orderBy: { word: "asc" },
      });
      if (!nameResult) return null;
      for (const eachName of nameResult) {
        if (eachName.tagId) {
          tags.push({
            id: eachName.tagId,
            tagName: eachName.word,
            isClass: true,
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
