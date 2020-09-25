import { arg, queryField } from "@nexus/schema";

export const getClassList = queryField("getClassList", {
  type: "idNameThumbnail",
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
          names: { where: { lang: "VI" }, select: { word: true } },
        },
      });
      for (const eachClass of queryResult) {
        classNames.push({ id: eachClass.id, name: eachClass.names[0].word });
      }
      return classNames;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
