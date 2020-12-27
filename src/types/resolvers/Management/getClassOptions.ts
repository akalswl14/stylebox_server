import { arg, queryField } from "@nexus/schema";

export const getClassOptions = queryField("getClassOptions", {
  type: "idNameClassThumbnail",
  args: { category: arg({ type: "Category", required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { category } = args;
      let queryResult,
        classNames = [];
      queryResult = await ctx.prisma.class.findMany({
        where: { category },
        select: {
          id: true,
        },
      });
      for (const eachClass of queryResult) {
        const classNameQueryResult = await ctx.prisma.className.findMany({
          where: { classId: eachClass.id, lang: "VI" },
          select: { word: true },
        });
        if (
          eachClass.id &&
          classNameQueryResult.length > 0 &&
          classNameQueryResult[0]
        ) {
          classNames.push({
            id: eachClass.id,
            name: classNameQueryResult[0].word,
          });
        } else {
          continue;
        }
      }
      return classNames;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
