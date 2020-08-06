import { stringArg, mutationField, arg, intArg } from "@nexus/schema";

export const createShop = mutationField("createShop", {
  type: "Shop",
  args: {
    name: arg({ type: "NameInputType", required: true, list: true }),
    discription: stringArg({ required: true }),
    images: arg({ type: "ImageInputType", required: true, list: true }),
    coordinate: stringArg({ nullable: true }),
    address: stringArg({ nullable: true, list: true }),
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
        address = [],
        tags = [],
        city = "",
      } = args;
      let shop,
        tagList: { id: number }[] = [];
      if (tags) {
        tags.forEach((eachTag: number) => {
          tagList.push({ id: eachTag });
        });
      }
      shop = await ctx.prisma.shop.create({
        data: {
          discription,
          coordinate,
          address: { set: address },
          city,
          tags: { connect: tagList },
          wishersCnt: 0,
          name: { create: name },
          images: { create: images },
        },
      });
      return shop;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
