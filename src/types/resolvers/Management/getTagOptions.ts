import { intArg, queryField } from "@nexus/schema";

export const getTagOptions = queryField("getTagOptions", {
  type: "idNameTagThumbnail",
  args: { classId: intArg({ required: true }) },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { classId } = args;
      let queryResult,
        tagNames = [];
      queryResult = await ctx.prisma.tag.findMany({
        where: { classId },
        select: {
          id: true,
          names: { where: { lang: "VI" }, select: { word: true } },
        },
      });
      for (const eachTag of queryResult) {
        tagNames.push({ id: eachTag.id, name: eachTag.names[0].word });
      }
      return tagNames;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
