import { queryField, stringArg, intArg, booleanArg } from "@nexus/schema";
import { getUserId } from "../../../utils";
import { S3_URL } from "../AWS_IAM";

export const getEvents = queryField("getEvents", {
  type: "EventList",
  args: {
    lang: stringArg({ nullable: true }),
    cursorId: intArg({ nullable: true }),
    filter: intArg({ nullable: true }),
    locationTagId: intArg({ nullable: true }),
  },
  nullable: true,
  description: "filter is sorting standard(0 :(recent), 1 :(Dday))",
  resolve: async (_, args, ctx) => {
    try {
      const userId = Number(getUserId(ctx));
      if (!userId) {
        return null;
      }
      const { cursorId, locationTagId } = args;
      let { filter, lang } = args;
      let totalEventNum,
        isLikeEvent,
        Dday,
        prismaQueryResults,
        secondPrismaQueryResults,
        events = [],
        settingQueryResult,
        loadingPostNum,
        checkEventIdResult,
        loadingEventNum,
        myCursor,
        check,
        ChechkCursorId,
        tags,
        DdayEventCheck = false;

      if (!filter) filter = 0;
      if (!lang) lang = "VI";

      settingQueryResult = await ctx.prisma.setting.findOne({
        where: { id: 1 },
        select: { loadingPostNum: true },
      });

      loadingPostNum = settingQueryResult
        ? settingQueryResult.loadingPostNum
        : 20;

      if (locationTagId) {
        if (locationTagId === 35) {
          let othersTagInfo = await ctx.prisma.tag.findMany({
            where: { classId: 15 },
            select: { id: true },
          });
          tags = { some: { names: { some: { lang } }, OR: othersTagInfo } };
        } else {
          tags = { some: { names: { some: { lang } }, id: locationTagId } };
        }
      } else {
        tags = { some: { names: { some: { lang } } } };
      }

      totalEventNum = await ctx.prisma.event.count({
        where: {
          tags,
          isOnList: true,
        },
      });

      if (filter === 0) {
        if (!cursorId) {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
            take: loadingPostNum,
            where: {
              tags,
              isOnList: true,
            },
          });
        } else {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { createdAt: "desc" },
            take: loadingPostNum,
            skip: 1,
            cursor: { id: cursorId },
            where: {
              tags,
              isOnList: true,
            },
          });
        }
      } else {
        checkEventIdResult = await ctx.prisma.event.findMany({
          orderBy: { dueDate: "asc" },
          where: {
            tags,
            dueDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
            isOnList: true,
          },
        });

        const idx = checkEventIdResult.length - 1;
        myCursor = idx > 0 ? checkEventIdResult[idx].id : 0; //기간 지나지 않은것들중 마지막 Id

        if (!cursorId) {
          prismaQueryResults = await ctx.prisma.event.findMany({
            orderBy: { dueDate: "asc" },
            take: loadingPostNum,
            where: {
              tags,
              dueDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
              isOnList: true,
            },
          });

          const idx1 = prismaQueryResults.length - 1;
          let myCursor1 = idx1 > 0 ? prismaQueryResults[idx1].id : 0;

          if (myCursor === myCursor1) {
            DdayEventCheck = true;
            loadingEventNum = loadingPostNum - prismaQueryResults.length;
            loadingEventNum = loadingEventNum !== 0 ? loadingEventNum : 0;

            secondPrismaQueryResults = await ctx.prisma.event.findMany({
              orderBy: { dueDate: "desc" },
              take: loadingEventNum,
              where: {
                tags,
                dueDate: { lt: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
                isOnList: true,
              },
            });
          }
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
            prismaQueryResults = await ctx.prisma.event.findMany({
              orderBy: { dueDate: "asc" },
              take: loadingPostNum,
              skip: 1,
              cursor: { id: cursorId },
              where: {
                tags,
                dueDate: { gte: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
                isOnList: true,
              },
            });

            if (prismaQueryResults.length > 0) {
              const idx1 = prismaQueryResults.length - 1;
              const lastPostInResults = prismaQueryResults[idx1];
              ChechkCursorId = lastPostInResults.id;
            } else {
              ChechkCursorId = myCursor;
            }

            if (ChechkCursorId === myCursor) {
              DdayEventCheck = true;
              loadingEventNum = loadingPostNum - prismaQueryResults.length;
              loadingEventNum = loadingEventNum !== 0 ? loadingEventNum : 0;

              secondPrismaQueryResults = await ctx.prisma.event.findMany({
                orderBy: { dueDate: "desc" },
                take: loadingEventNum,
                where: {
                  tags,
                  dueDate: { lt: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
                  isOnList: true,
                },
              });
            }
          } else {
            prismaQueryResults = await ctx.prisma.event.findMany({
              orderBy: { dueDate: "desc" },
              take: loadingEventNum,
              skip: 1,
              cursor: { id: cursorId },
              where: {
                tags,
                dueDate: { lt: new Date(new Date().setUTCHours(0, 0, 0, 0)) },
                isOnList: true,
              },
            });
          }
        }
      }

      for (const item of prismaQueryResults) {
        isLikeEvent =
          (await ctx.prisma.like.count({
            where: { userId, eventId: item.id },
          })) > 0
            ? true
            : false;

        let Dueday = new Date(item.dueDate.setUTCHours(0, 0, 0, 0));
        let now = new Date(new Date().setUTCHours(0, 0, 0, 0));
        let gap = Dueday.getTime() - now.getTime();
        Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;

        events.push({
          eventId: item.id,
          bannerImage: S3_URL + item.bannerImage,
          isLikeEvent,
          Dday,
        });
      }

      if (DdayEventCheck) {
        if (secondPrismaQueryResults) {
          for (const item of secondPrismaQueryResults) {
            isLikeEvent =
              (await ctx.prisma.like.count({
                where: { userId, eventId: item.id },
              })) > 0
                ? true
                : false;

            let Dueday = new Date(item.dueDate.setUTCHours(0, 0, 0, 0));
            let now = new Date(new Date().setUTCHours(0, 0, 0, 0));
            let gap = Dueday.getTime() - now.getTime();
            Dday = Math.floor(gap / (1000 * 60 * 60 * 24)) * -1;

            events.push({
              eventId: item.id,
              bannerImage: S3_URL + item.bannerImage,
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
