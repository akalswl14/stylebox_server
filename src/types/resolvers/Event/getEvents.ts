import { queryField, stringArg, intArg, booleanArg } from '@nexus/schema';
import { getUserId } from '../../../utils';

export const getEvents = queryField('getEvents', {
  type: 'EventList',
  args: {
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
    filter: intArg({ nullable: true }),
  },
  nullable: true,
  description: 'filter is sorting standard(0 :(recent), 1 :(Dday))',
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
        DdayEventCheck = false;

      if (!filter) filter = 0;
      if (!lang) lang = 'ENG';

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

      if (filter === 0) {
        if (!cursorId) {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: loadingPostNum,
            where: {
              tags: { some: { names: { some: { lang } } } },
              isOnList: true,
            },
            include: { preferrers: true },
          });
        } else {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
            take: loadingPostNum,
            skip: 1,
            cursor: { id: cursorId },
            where: {
              tags: { some: { names: { some: { lang } } } },
              isOnList: true,
            },
            include: { preferrers: true },
          });
        }
      } else {
        checkEventIdResult = await ctx.prisma.event.findMany({
          orderBy: { dueDate: 'asc' },
          where: {
            tags: { some: { names: { some: { lang } } } },
            dueDate: { gte: new Date() },
            isOnList: true,
          },
          include: { preferrers: true },
        });

        if (!checkEventIdResult) return null;

        const idx = checkEventIdResult.length - 1;
        lastPostInResults = checkEventIdResult[idx];
        myCursor = lastPostInResults.id; //기간 지나지 않은것들중 마지막 Id

        if (!cursorId) {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { dueDate: 'asc' },
            take: loadingPostNum,
            where: {
              tags: { some: { names: { some: { lang } } } },
              dueDate: { gte: new Date() },
              isOnList: true,
            },
            include: { preferrers: true },
          });
        } else {
          check = await ctx.prisma.event.findMany({
            orderBy: { dueDate: 'asc' },
            where: {
              id: cursorId,
              dueDate: { gte: new Date() },
              isOnList: true,
            },
          }); //cursorId가 기간이 지나지 않은 event의 Id인지

          if (check) {
            prismaQueryResults = await ctx.prisma.event.findMany({
              orderBy: { dueDate: 'asc' },
              take: loadingPostNum,
              skip: 1,
              cursor: { id: cursorId },
              where: {
                tags: { some: { names: { some: { lang } } } },
                dueDate: { gte: new Date() },
                isOnList: true,
              },
              include: { preferrers: true },
            });

            const idx1 = prismaQueryResults.length - 1;
            const lastPostInResults = prismaQueryResults[idx1];
            const ChechkCursorId = lastPostInResults.id;

            if (ChechkCursorId === myCursor) {
              DdayEventCheck = true;
              loadingEventNum = loadingPostNum - prismaQueryResults.length;
              loadingEventNum =
                loadingEventNum !== 0 ? loadingEventNum : loadingPostNum;
              secondPrismaQueryResults = await ctx.prisma.event.findMany({
                orderBy: { dueDate: 'desc' },
                take: loadingEventNum,
                where: {
                  tags: { some: { names: { some: { lang } } } },
                  dueDate: { lt: new Date() },
                  isOnList: true,
                },
                include: { preferrers: true },
              });
            }
          } else {
            prismaQueryResults = await ctx.prisma.event.findMany({
              orderBy: { dueDate: 'desc' },
              take: loadingPostNum,
              skip: 1,
              cursor: { id: cursorId },
              where: {
                tags: { some: { names: { some: { lang } } } },
                dueDate: { lt: new Date() },
                isOnList: true,
              },
              include: { preferrers: true },
            });
          }
        }
      }

      for (const item of prismaQueryResults) {
        preferrersCheck = item.preferrers.filter(
          (item) => item.userId === userId
        );

        isLikeEvent = preferrersCheck ? true : false;

        let Dueday = new Date(item.dueDate);
        let now = new Date();
        let gap = Dueday.getTime() - now.getTime();
        Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) + 1;

        Dday = Dday < 0 ? 0 : Dday;

        events.push({
          eventId: item.id,
          bannerImage: item.bannerImage,
          isLikeEvent,
          Dday,
          bannerText: item.bannerText,
        });
      }

      if (DdayEventCheck) {
        if (secondPrismaQueryResults) {
          for (const item of secondPrismaQueryResults) {
            preferrersCheck = item.preferrers.filter(
              (item) => item.userId === userId
            );

            isLikeEvent = preferrersCheck ? true : false;

            let Dueday = new Date(item.dueDate);
            let now = new Date();
            let gap = Dueday.getTime() - now.getTime();
            Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) + 1;

            Dday = Dday < 0 ? 0 : Dday;

            events.push({
              eventId: item.id,
              bannerImage: item.bannerImage,
              isLikeEvent,
              Dday,
              bannerText: item.bannerText,
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
