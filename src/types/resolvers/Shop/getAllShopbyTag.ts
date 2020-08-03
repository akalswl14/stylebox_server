import { intArg, queryField } from "@nexus/schema";

export const getAllShopbyTag = queryField("getAllShopbyTag", {
  type: "Shop",
  args: {
    tags: intArg({ list: true, required: true }),
    id: intArg({ nullable: true }),
    pageNum: intArg({ required: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id, pageNum } = args;
      let shops: any[] = [],
        beforeNum,
        noWishshops,
        noWishNum = take,
        tagList: {
          id: number;
        }[] = [];
      beforeNum = (pageNum - 1) * take;
      if (tags) {
        tags.forEach((eachTag: any) => {
          tagList.push({ id: eachTag });
        });
      }
      let WishWhere = {
        tags: { some: { OR: tagList } },
        wishersCnt: { gt: 0 },
      };
      let noWishWhere = {
        tags: { some: { OR: tagList } },
        wishersCnt: { equals: 0 },
      };
      let originalshopsNum = await ctx.prisma.shop.count({
        where: { tags: { some: { OR: tagList } }, wishersCnt: { gt: 0 } },
      });
      if (id) {
        if (beforeNum <= originalshopsNum) {
          shops = await ctx.prisma.shop.findMany({
            where: WishWhere,
            orderBy: { wishersCnt: "desc" },
            take: take,
            skip: skip,
            cursor: { id },
          });
          if (beforeNum < originalshopsNum) {
            noWishNum = take - shops.length;
          }
          noWishshops = await ctx.prisma.shop.findMany({
            where: noWishWhere,
            orderBy: { createdAt: "desc" },
            take: noWishNum,
          });
        } else {
          noWishshops = await ctx.prisma.shop.findMany({
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
        noWishshops = await ctx.prisma.shop.findMany({
          where: noWishWhere,
          orderBy: { createdAt: "desc" },
          take: noWishNum,
        });
      }
      console.log([...shops, ...noWishshops]);
      return [...shops, ...noWishshops];
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
