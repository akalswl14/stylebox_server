import { queryField, stringArg, arg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getSearchTagLogs = queryField("getSearchTagLogs", {
  type: "ClassTagDetail",
  args: {
    lang: stringArg({ nullable: true }),
    filterDate: arg({ type: "DateTime", nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { filterDate } = args;
      const lang = args.lang ?? "VI";
      let queryResult,
        order = 0,
        tags = [];
      const userId = Number(getUserId(ctx));
      if (!userId) return null;
      if (filterDate) {
        queryResult = await ctx.prisma.searchTagLog.findMany({
          where: { userId, createdAt: { gte: filterDate } },
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            Tag: {
              select: {
                id: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
          },
        });
      } else {
        queryResult = await ctx.prisma.searchTagLog.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            Tag: {
              select: {
                id: true,
                names: { where: { lang }, select: { word: true } },
              },
            },
          },
        });
      }
      for (const eachTag of queryResult) {
        if (!eachTag.Tag) continue;
        tags.push({
          id: eachTag.Tag.id,
          tagName:
            eachTag.Tag.names &&
            eachTag.Tag.names.length > 0 &&
            eachTag.Tag.names[0].word
              ? eachTag.Tag.names[0].word
              : null,
          order,
        });
        order++;
      }
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
