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
    name: arg({ type: "NameInputType", nullable: true, list: true }),
    images: arg({ type: "ImageInputType", nullable: true, list: true }),
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
          tags.forEach((eachTag: number) => {
            tagList.push({ id: eachTag });
          });
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
          if (originalImageList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { images: { disconnect: originalImageList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { images: { create: images } },
          });
        }
        if (name) {
          let originalNameInfoList = originalShop.name;
          let originalNameList: { id: number }[] = [];
          originalNameInfoList.forEach((eachName) => {
            originalNameList.push({ id: eachName.id });
          });
          if (originalNameList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { name: { disconnect: originalNameList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { name: { create: name } },
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
      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
