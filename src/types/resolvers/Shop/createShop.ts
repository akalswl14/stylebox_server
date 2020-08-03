import { stringArg, mutationField, arg, intArg } from "@nexus/schema";
import { connect } from "http2";

export const createShop = mutationField("createShop", {
  type: "Shop",
  args: {
    name: arg({ type: "shopNameInputType", required: true, list: true }),
    discription: stringArg({ required: true }),
    images: arg({ type: "shopImageInputType", required: true, list: true }),
    coordinate: stringArg({ nullable: true }),
    address: stringArg({ nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    city: stringArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        name,
        discription,
        images,
        coordinate = "",
        address = "",
        tags = [],
        city = "",
      } = args;
      let shop,
        tagList: { id: number }[] = [];
      if (tags) {
        tags.forEach((eachTag) => {
          tagList.push({ id: eachTag });
        });
      }
      shop = await ctx.prisma.shop.create({
        data: {
          discription,
          coordinate,
          address,
          city,
          tags: { connect: tagList },
          wishersCnt: 0,
        },
      });
      if (shop) {
        const shopId = shop.id;
        name.forEach(async (eachName) => {
          await ctx.prisma.shopName.create({
            data: {
              lang: eachName.lang,
              word: eachName.word,
              Shop: { connect: { id: shopId } },
            },
          });
        });
        images.forEach(async (eachImage) => {
          await ctx.prisma.shopImage.create({
            data: {
              url: eachImage.url,
              order: eachImage.order,
              Shop: { connect: { id: shopId } },
            },
          });
        });
        shop = ctx.prisma.shop.findOne({ where: { id: shop.id } });
      }
      return shop;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
