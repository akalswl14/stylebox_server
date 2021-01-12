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
      const lang = args.lang ?? "VI";
      let nameResult,
        tags = [];
      nameResult = await ctx.prisma.tagName.findMany({
        where: { lang, Tag: { category: "Feature" } },
        select: { word: true, tagId: true },
        orderBy: { word: "asc" },
      });
      if (!nameResult) return null;
      let order = 0;
      for (const eachName of nameResult) {
        if (eachName.tagId) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: eachName.tagId } } },
          });
          if (postNum > 0) {
            tags.push({
              id: eachName.tagId,
              tagName: eachName.word,
              isClass: false,
              order,
            });
            order++;
          }
        }
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
