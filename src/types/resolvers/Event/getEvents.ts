import { queryField, stringArg, intArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";

export const getEvents = queryField("getEvents", {
  type: "EventList",
  args: {
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
    filter: intArg({ nullable: true }),
  },
  nullable: true,
  description: "filter is sorting standard(0 :(recent), 1 :(Dday))",
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      const { cursorId } = args;
      let { filter, lang } = args;
      let totalEventNum,
        isLikeEvent,
        Dday,
        prismaQueryResults,
        secondPrismaQueryResults,
        events = [],
        settingQueryResult,
        preferrersCheck,
        loadingPostNum,
        checkEventIdResult,
        lastPostInResults,
        loadingEventNum,
        myCursor,
        check,
        DdayEventCheck = false,
        QueryOption_filter0,
        QueryOption_filter1,
        QueryOption_filter1_desc;

      if (!filter) filter = 0;
      if (!lang) lang = 'VI';

      totalEventNum = await ctx.prisma.event.count({
        where: { tags: { some: { names: { some: { lang } } } } },
      });

      totalEventNum = totalEventNum ? totalEventNum : 0;

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      QueryOption_filter0 = {
        orderBy: { createdAt: "desc" },
        take: loadingPostNum,
        where: {
          tags: { some: { names: { some: { lang } } } },
          isOnList: true,
        },
        include: { preferrers: true },
      };

      QueryOption_filter1 = {
        orderBy: { dueDate: "asc" },
        where: {
          tags: { some: { names: { some: { lang } } } },
          dueDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
          isOnList: true,
        },
        include: { preferrers: true },
      };

      QueryOption_filter1_desc = {
        orderBy: { dueDate: "desc" },
        take: loadingEventNum,
        where: {
          tags: { some: { names: { some: { lang } } } },
          dueDate: { lt: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
          isOnList: true,
        },
        include: { preferrers: true },
      };

      if (filter === 0) {
        if (!cursorId) {
          prismaQueryResults = await ctx.prisma.event.findMany(
            QueryOption_filter0
          );
        } else {
          QueryOption_filter0.skip = 1;
          QueryOption_filter0.cursor = { id: cursorId };
          prismaQueryResults = await ctx.prisma.event.findMany(
            QueryOption_filter0
          );
        }
      } else {
        checkEventIdResult = await ctx.prisma.event.findMany(
          QueryOption_filter1
        );

        if (!checkEventIdResult) return null;

        const idx = checkEventIdResult.length - 1;
        lastPostInResults = checkEventIdResult[idx];
        myCursor = lastPostInResults.id; //기간 지나지 않은것들중 마지막 Id

        if (!cursorId) {
          QueryOption_filter1.take = loadingPostNum;
          prismaQueryResults = await ctx.prisma.event.findMany(
            QueryOption_filter1
          );
        } else {
          check = await ctx.prisma.event.findMany({
            orderBy: { dueDate: "asc" },
            where: {
              id: cursorId,
              dueDate: { gt: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
              isOnList: true,
            },
          }); //cursorId가 기간이 지나지 않은 event의 Id인지

          if (check.length > 0) {
            QueryOption_filter1.take = loadingPostNum;
            QueryOption_filter1.skip = 1;
            QueryOption_filter1.cursor = { id: cursorId };
            prismaQueryResults = await ctx.prisma.event.findMany(
              QueryOption_filter1
            );

            if (prismaQueryResults.length > 0) {
              const idx1 = prismaQueryResults.length - 1;
              const lastPostInResults = prismaQueryResults[idx1];
              let ChechkCursorId = lastPostInResults.id;
            } else {
              let ChechkCursorId = myCursor;
            }

            if (ChechkCursorId === myCursor) {
              DdayEventCheck = true;
              loadingEventNum = loadingPostNum - prismaQueryResults.length;
              loadingEventNum = loadingEventNum !== 0 ? loadingEventNum : 0;

              secondPrismaQueryResults = await ctx.prisma.event.findMany(
                QueryOption_filter1_desc
              );
            }
          } else {
            QueryOption_filter1_desc.skip = 1;
            QueryOption_filter1_desc.cursor = { id: cursorId };
            prismaQueryResults = await ctx.prisma.event.findMany(
              QueryOption_filter1_desc
            );
          }
        }
      }

      for (const item of prismaQueryResults) {
        preferrersCheck = item.preferrers.filter(
          (item) => item.userId === userId
        );

        isLikeEvent = preferrersCheck ? true : false;

        let Dueday = new Date(item.dueDate.setUTCHours(0, 0, 0, 0));
        let now = new Date(new Date().setUTCHours(0, 0, 0, 0));
        let gap = Dueday.getTime() - now.getTime();
        Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;

        events.push({
          eventId: item.id,
          bannerImage: item.bannerImage,
          isLikeEvent,
          Dday,
        });
      }

      if (DdayEventCheck) {
        if (secondPrismaQueryResults) {
          for (const item of secondPrismaQueryResults) {
            preferrersCheck = item.preferrers.filter(
              (item) => item.userId === userId
            );

            isLikeEvent = preferrersCheck ? true : false;

            let Dueday = new Date(item.dueDate.setUTCHours(0, 0, 0, 0));
            let now = new Date(new Date().setUTCHours(0, 0, 0, 0));
            let gap = Dueday.getTime() - now.getTime();
            Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;

            events.push({
              eventId: item.id,
              bannerImage: item.bannerImage,
              isLikeEvent,
              Dday,
            });
          }
        }
      }

      let rtn = {
        totalEventNum,
        events,
      };

      return rtn ? rtn : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
