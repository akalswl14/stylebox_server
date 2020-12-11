import { intArg, mutationField } from "@nexus/schema";

export const getTagsbyShop = mutationField("getTagsbyShop", {
  type: "TagManagementThumbnail",
  args: {
    shopId: intArg({ required: true }),
    tags: intArg({ required: true, list: [true] }),
  },
  list: true,
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { shopId, tags } = args;
      const rtnTags = [];
      const shopTagIds: number[] = [];
      const lang = "VI";
      let order = 1;
      const shopTags = await ctx.prisma.tag.findMany({
        where: {
          OR: [{ shops: { some: { id: shopId } } }, { id: { in: tags } }],
          category: { not: "ShopName" },
        },
        orderBy: { id: "asc" },
        select: {
          id: true,
          names: { where: { lang }, select: { word: true } },
          classId: true,
          category: true,
        },
      });
      for (const eachData of shopTags) {
        if (
          !eachData ||
          typeof eachData.id !== "number" ||
          eachData.names.length <= 0 ||
          !eachData.names[0].word ||
          typeof eachData.classId !== "number" ||
          !eachData.category
        ) {
          continue;
        }
        if (shopTagIds.indexOf(eachData.id) !== -1) {
          continue;
        }
        let classResult = await ctx.prisma.className.findMany({
          where: { classId: eachData.classId, lang },
          select: { word: true },
        });
        if (!classResult || classResult.length <= 0 || !classResult[0].word) {
          continue;
        }
        rtnTags.push({
          tagId: eachData.id,
          tagName: eachData.names[0].word,
          classId: eachData.classId,
          className: classResult[0].word,
          category: eachData.category,
          order,
        });
        shopTagIds.push(eachData.id);
        order++;
      }
      return rtnTags;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
