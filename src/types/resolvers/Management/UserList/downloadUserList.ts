import { queryField } from "@nexus/schema";

export const downloadUserList = queryField("downloadUserList", {
  type: "UserManagementThumbnail",
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      let users = [];
      let userResult = await ctx.prisma.user.findMany({
        select: {
          id: true,
          createdAt: true,
        },
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
      return users;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
