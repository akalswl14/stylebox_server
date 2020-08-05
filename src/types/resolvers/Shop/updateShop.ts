import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updateShop = mutationField("updateShop", {
  type: "Shop",
  args: {
    id: intArg({ required: true }),
    discription: stringArg({ nullable: true }),
    coordinate: stringArg({ nullable: true }),
    address: stringArg({ nullable: true, list: true }),
    city: stringArg({ nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    name: arg({ type: "shopNameInputType", nullable: true, list: true }),
    images: arg({ type: "shopImageInputType", nullable: true, list: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let {
        id,
        discription,
        coordinate,
        address,
        city,
        tags,
        name,
        images,
      } = args;
      let shop,
        originalShop,
        tagList: { id: number }[] = [];
      if (tags) {
        tags.forEach((eachTag: number) => {
          tagList.push({ id: eachTag });
        });
      }
      try {
        originalShop = await ctx.prisma.shop.findOne({
          where: { id },
          include: { tags: true, name: true, images: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalShop) {
        if (tags) {
          let originalTagInfoList = originalShop.tags;
          let originalTagList: { id: number }[] = [];
          originalTagInfoList.forEach((eachTag) => {
            originalTagList.push({ id: eachTag.id });
          });
          await ctx.prisma.shop.update({
            where: { id },
            data: { tags: { connect: tagList, disconnect: originalTagList } },
          });
        }
        if (images) {
          let originalImageInfoList = originalShop.images;
          let originalImageList: { id: number }[] = [];
          originalImageInfoList.forEach((eachImage) => {
            originalImageList.push({ id: eachImage.id });
          });
          await ctx.prisma.shop.update({
            where: { id },
            data: { images: { disconnect: originalImageList } },
          });
          images.forEach(async (eachImage: { url: string; order: number }) => {
            await ctx.prisma.shopImage.create({
              data: {
                url: eachImage.url,
                order: eachImage.order,
                Shop: { connect: { id } },
              },
            });
          });
        }
        if (name) {
          let originalNameInfoList = originalShop.images;
          let originalNameList: { id: number }[] = [];
          originalNameInfoList.forEach((eachName) => {
            originalNameList.push({ id: eachName.id });
          });
          console.log(originalNameList);
          await ctx.prisma.shop.update({
            where: { id },
            data: { name: { disconnect: originalNameList } },
          });
          name.forEach(async (eachName: { lang: string; word: string }) => {
            await ctx.prisma.shopName.create({
              data: {
                lang: eachName.lang,
                word: eachName.word,
                Shop: { connect: { id } },
              },
            });
          });
        }
        if (address) {
          shop = await ctx.prisma.shop.update({
            where: { id },
            data: { address: { set: address } },
          });
        }
        try {
          shop = await ctx.prisma.shop.update({
            where: { id },
            data: { discription, coordinate, city },
          });
        } catch (e) {
          console.log(e);
        }
      }
      if (shop) {
        return shop;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
