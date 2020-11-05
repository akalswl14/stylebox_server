import { queryField } from "@nexus/schema";

export const getPriceTagList = queryField("getPriceTagList", {
  type: "TagMapList",
  nullable: true,
  list: true,
  resolve: async (_, __, ctx) => {
    try {
      let tagList = [],
        lang;

      if (!lang) lang = "VI";

      let priceClasses = await ctx.prisma.class.findMany({
        where: { category: "Price" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
        },
      });

      for (const priceClass of priceClasses) {
        let tags = [];

        let priceTags = await ctx.prisma.tag.findMany({
          where: { category: "Price", classId: priceClass.id },
          select: {
            id: true,
            names: { where: { lang }, select: { word: true } },
          },
        });

        for (const priceTag of priceTags) {
          let postNum = await ctx.prisma.post.count({
            where: { tags: { some: { id: priceTag.id } } },
          });

          tags.push({
            tagId: priceTag.id,
            tagName: priceTag.names[0].word,
            postNum,
          });
        }

        tagList.push({
          classId: priceClass.id,
          className: priceClass.names[0].word,
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
