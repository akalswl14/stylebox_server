import { intArg, stringArg, queryField } from "@nexus/schema";

export const getAllShopbyRank = queryField("getAllShopbyRank", {
  type: "Shop",
  args: {
    id: intArg({ nullable: true }),
    pageNum: intArg({ required: true }),
    city: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { id, pageNum, city } = args;
      let shops: any[] = [],
        beforeNum,
        noWishNum = take;
      beforeNum = (pageNum - 1) * take;
      let noWishShops,
        originalShopsNum = 0;
      let WishWhere, noWishWhere;
      if (city) {
        WishWhere = {
          city,
          wishersCnt: { gt: 0 },
        };
        noWishWhere = {
          city,
          wishersCnt: { equals: 0 },
        };
      } else {
        WishWhere = {
          wishersCnt: { gt: 0 },
        };
        noWishWhere = {
          wishersCnt: { equals: 0 },
        };
      }
      if (city) {
        originalShopsNum = await ctx.prisma.shop.count({
          where: { city, wishersCnt: { gt: 0 } },
        });
      } else {
        originalShopsNum = await ctx.prisma.shop.count({
          where: { wishersCnt: { gt: 0 } },
        });
      }
      if (id) {
        if (beforeNum <= originalShopsNum) {
          shops = await ctx.prisma.shop.findMany({
            where: WishWhere,
            orderBy: { wishersCnt: "desc" },
            take: take,
            skip: skip,
            cursor: { id },
          });
          if (beforeNum < originalShopsNum) {
            noWishNum = take - shops.length;
          }
          noWishShops = await ctx.prisma.shop.findMany({
            where: noWishWhere,
            orderBy: { createdAt: "desc" },
            take: noWishNum,
          });
        } else {
          noWishShops = await ctx.prisma.shop.findMany({
            where: noWishWhere,
            orderBy: { createdAt: "desc" },
            take: noWishNum,
            skip: skip,
            cursor: { id },
          });
        }
      } else {
        shops = await ctx.prisma.shop.findMany({
          where: WishWhere,
          orderBy: { wishersCnt: "desc" },
        });
        noWishNum = take - shops.length;
        noWishShops = await ctx.prisma.shop.findMany({
          where: noWishWhere,
          orderBy: { createdAt: "desc" },
          take: noWishNum,
        });
      }
      console.log([...shops, ...noWishShops]);
      return [...shops, ...noWishShops];
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
