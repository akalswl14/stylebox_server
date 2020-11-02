import { queryField } from "@nexus/schema";

export const getStyleTagList = queryField("getStyleTagList", {
  type: "TagMapList",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tagList = [],
        lang;

      if (!lang) lang = "VI";

      let styleClasses = await ctx.prisma.class.findMany({
        where: { category: "Style" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const styleClass of styleClasses) {
        let tags = [];

        let styleTags = await ctx.prisma.tag.findMany({
          where: { category: "Style", classId: styleClass.id },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });

        for (const styleTag of styleTags) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: styleTag.id } } },
          });

          tags.push({
            tagId: styleTag.id,
            tagName: styleTag.names[0].word,
            postNum,
          });
        }

        tagList.push({
          classId: styleClass.id,
          className: styleClass.names[0].word,
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
