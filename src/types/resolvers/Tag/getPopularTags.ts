import { queryField, stringArg } from "@nexus/schema";

export const getPopularTags = queryField("getPopularTags", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { lang = "ENG" } = args;
      let tagResult,
        tags = [],
        order = 0;
      let queryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { popularTagId: true },
      });
      if (!queryResult) return null;
      for (const eachId of queryResult.popularTagId) {
        tagResult = await ctx.prisma.tag.findOne({
          where: { id: eachId },
          select: { names: { where: { lang }, select: { word: true } } },
        });
        if (tagResult) {
          tags.push({ id: eachId, tagName: tagResult.names[0].word, order });
          order++;
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
