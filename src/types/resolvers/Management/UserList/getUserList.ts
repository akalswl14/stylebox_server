import { booleanArg, intArg, queryField } from "@nexus/schema";

export const getUserList = queryField("getUserList", {
  type: "UserManagementThumbnail",
  args: {
    pageNum: intArg({ nullable: true }),
    userId: intArg({ nullable: true }),
    userIdAsc: booleanArg({ nullable: true }),
    installationDateAsc: booleanArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { userId, userIdAsc, installationDateAsc } = args;
      let { pageNum } = args;
      if (!pageNum) pageNum = 1;
      const loadingNum = 13;
      let skipNum = loadingNum * (pageNum - 1);
      let orderByOption:
          | {
              id: "asc" | "desc";
            }
          | {
              createdAt: "asc" | "desc";
            }
          | (
              | {
                  id: "asc" | "desc";
                }
              | {
                  createdAt: "asc" | "desc";
                }
            )[],
        whereOption,
        userResult,
        queryResult,
        users = [];
      if (typeof userIdAsc === "boolean") {
        orderByOption = userIdAsc ? { id: "asc" } : { id: "desc" };
      } else if (typeof installationDateAsc === "boolean") {
        orderByOption = installationDateAsc
          ? { createdAt: "asc" }
          : { createdAt: "desc" };
      } else {
        orderByOption = [{ id: "asc" }, { createdAt: "asc" }];
      }
      if (userId) {
        whereOption = { id: userId };
      }
      userResult = await ctx.prisma.user.findMany({
        where: whereOption,
        select: {
          id: true,
          createdAt: true,
        },
        orderBy: orderByOption,
        skip: skipNum,
        take: loadingNum,
      });
      for (const eachUser of userResult) {
        let PostLikeNum = await ctx.prisma.like.count({
          where: { userId: eachUser.id, postId: { gte: 0 } },
        });
        let ShopLikeNum = await ctx.prisma.like.count({
          where: { userId: eachUser.id, shopId: { gte: 0 } },
        });
        let EventLikeNum = await ctx.prisma.like.count({
          where: { userId: eachUser.id, eventId: { gte: 0 } },
        });
        users.push({
          userId: eachUser.id,
          installationDate: eachUser.createdAt,
          PostLikeNum,
          ShopLikeNum,
          EventLikeNum,
        });
      }
      let totalUserNum = await ctx.prisma.user.count({
        where: whereOption,
      });
      return {
        totalUserNum,
        users,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
