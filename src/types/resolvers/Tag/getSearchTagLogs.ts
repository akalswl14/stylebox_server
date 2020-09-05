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
      const { filterDate, lang = "ENG" } = args;
      let tags;
      const userId = Number(getUserId(ctx));
      if (filterDate) {
        tags = await ctx.prisma.searchTagLog.findMany({
          where: { userId, createdAt: { gte: filterDate } },
          orderBy: { createdAt: "desc" },
          take: 5,
        });
      }
      tags = await ctx.prisma.searchTagLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
      });
      return tags ? tags : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
