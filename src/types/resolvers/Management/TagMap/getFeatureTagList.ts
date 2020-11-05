import { queryField } from "@nexus/schema";

export const getFeatureTagList = queryField("getFeatureTagList", {
  type: "TagMapList",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tagList = [],
        lang;

      if (!lang) lang = "VI";

      let featureClasses = await ctx.prisma.class.findMany({
        where: { category: "Feature" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const featureClass of featureClasses) {
        let tags = [];

        let featureTags = await ctx.prisma.tag.findMany({
          where: { category: "Feature", classId: featureClass.id },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });

        for (const featureTag of featureTags) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: featureTag.id } } },
          });

          tags.push({
            tagId: featureTag.id,
            tagName: featureTag.names[0].word,
            postNum,
          });
        }

        tagList.push({
          classId: featureClass.id,
          className: featureClass.names[0].word,
          tags,
        });
      }

      return tagList ? tagList : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
