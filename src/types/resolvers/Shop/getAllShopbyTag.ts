import { intArg, queryField, stringArg } from "@nexus/schema";
import { ShopName, Shop } from "../../models";

export const getAllShopbyTag = queryField("getAllShopbyTag", {
  type: "Shop",
  args: {
    tags: intArg({ list: true, required: true }),
    id: intArg({ nullable: true }),
    lang: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const skip = 1,
        take = 4;
      const { tags, id, pageNum, lang = "ENG" } = args;
      let shops: any[] = [],
        shopNameList,
        tagList: {
          id: number;
        }[] = [];
      if (tags) {
        tags.forEach((eachTag: any) => {
          tagList.push({ id: eachTag });
        });
      }
      if (id) {
        shopNameList = await ctx.prisma.shopName.findMany({
          where: {
            lang,
            Shop: {
              tags: { some: { OR: tagList } },
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
              tags: { some: { OR: tagList } },
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
          let rtn = await ctx.prisma.shop.findOne({
            where: { id: eachName.shopId },
          });
          shops.push(rtn);
        }
      }
      return shops;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
