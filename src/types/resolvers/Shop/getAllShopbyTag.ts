import { intArg, queryField, stringArg, arg } from "@nexus/schema";

export const getAllShopbyTag = queryField("getAllShopbyTag", {
  type: "Shop",
  args: {
    tags: arg({ type: "idDicInputType", list: true, required: true }),
    id: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  description: "id argument is for cursor and lang argument is for Shop Name.",
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id, lang = "ENG" } = args;
      let shops: any[] = [],
        shopNameList;
      if (id) {
        shopNameList = await ctx.prisma.shopName.findMany({
          where: {
            lang,
            Shop: {
              tags: { some: { OR: tags } },
            },
          },
          orderBy: { word: "asc" },
          take: take,
          skip: skip,
          cursor: { id },
        });
      } else {
        shopNameList = await ctx.prisma.shopName.findMany({
          where: {
            lang,
            Shop: {
              tags: { some: { OR: tags } },
            },
          },
          orderBy: { word: "asc" },
          take: take,
          skip: skip,
          select: { shopId: true },
        });
      }
      if (shopNameList) {
        for (const eachName of shopNameList) {
          if (eachName.shopId) {
            let rtn = await ctx.prisma.shop.findOne({
              where: { id: eachName.shopId },
            });
            shops.push(rtn);
          }
        }
      }
      return shops;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
