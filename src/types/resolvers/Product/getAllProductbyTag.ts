import { intArg, stringArg, queryField } from "@nexus/schema";

export const getAllProductbyTag = queryField("getAllProductbyTag", {
  type: "Product",
  args: {
    tags: intArg({ list: true, required: true }),
    filter: stringArg({ nullable: true }),
    id: intArg({ nullable: true }),
    pageNum: intArg({ required: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, filter = "NEW", id, pageNum } = args;
      let products: any[] = [],
        beforeNum,
        noWishNum = take,
        tagList: {
          id: number;
        }[] = [];
      beforeNum = (pageNum - 1) * take;
      if (tags) {
        tags.forEach((eachTag) => {
          tagList.push({ id: eachTag });
        });
      }
      if (filter == "RANK") {
        let noWishProducts;
        let WishWhere = {
          tags: { some: { OR: tagList } },
          wishersCnt: { gt: 0 },
        };
        let noWishWhere = {
          tags: { some: { OR: tagList } },
          wishersCnt: { equals: 0 },
        };
        let originalProductsNum = await ctx.prisma.product.count({
          where: { tags: { some: { OR: tagList } }, wishersCnt: { gt: 0 } },
        });
        if (id) {
          if (beforeNum <= originalProductsNum) {
            products = await ctx.prisma.product.findMany({
              where: WishWhere,
              orderBy: { wishersCnt: "desc" },
              take: take,
              skip: skip,
              cursor: { id },
            });
            if (beforeNum < originalProductsNum) {
              noWishNum = take - products.length;
            }
            noWishProducts = await ctx.prisma.product.findMany({
              where: noWishWhere,
              orderBy: { createdAt: "desc" },
              take: noWishNum,
            });
          } else {
            noWishProducts = await ctx.prisma.product.findMany({
              where: noWishWhere,
              orderBy: { createdAt: "desc" },
              take: noWishNum,
              skip: skip,
              cursor: { id },
            });
          }
        } else {
          products = await ctx.prisma.product.findMany({
            where: WishWhere,
            orderBy: { wishersCnt: "desc" },
          });
          noWishNum = take - products.length;
          noWishProducts = await ctx.prisma.product.findMany({
            where: noWishWhere,
            orderBy: { createdAt: "desc" },
            take: noWishNum,
          });
        }
        console.log([...products, ...noWishProducts]);
        return [...products, ...noWishProducts];
      } else {
        // filter == "NEW"
        if (id) {
          products = await ctx.prisma.product.findMany({
            where: { tags: { some: { OR: tagList } } },
            orderBy: { createdAt: "desc" },
            take: take,
            cursor: { id },
            skip: skip,
          });
        } else {
          products = await ctx.prisma.product.findMany({
            where: { tags: { some: { OR: tagList } } },
            orderBy: { createdAt: "desc" },
            take: take,
          });
        }
        return products;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
