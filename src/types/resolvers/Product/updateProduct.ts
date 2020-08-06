import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
    shops: intArg({ list: true, nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    name: arg({ type: "NameInputType", nullable: true, list: true }),
    image: arg({ type: "ImageInputType", nullable: true, list: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let { id, description, instaText, shops, tags, name, image } = args;
      let product,
        originalproduct,
        tagList: { id: number }[] = [],
        shopList: { id: number }[] = [];
      try {
        originalproduct = await ctx.prisma.product.findOne({
          where: { id },
          include: { tags: true, name: true, image: true, shops: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalproduct) {
        if (tags) {
          tags.forEach((eachTag: number) => {
            tagList.push({ id: eachTag });
          });
          let originalTagInfoList = originalproduct.tags;
          let originalTagList: { id: number }[] = [];
          originalTagInfoList.forEach((eachTag) => {
            originalTagList.push({ id: eachTag.id });
          });
          if (originalTagList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { tags: { disconnect: originalTagList } },
            });
          }
          await ctx.prisma.product.update({
            where: { id },
            data: { tags: { connect: tagList } },
          });
        }
        if (image) {
          let originalImageInfoList = originalproduct.image;
          let originalImageList: { id: number }[] = [];
          originalImageInfoList.forEach((eachImage) => {
            originalImageList.push({ id: eachImage.id });
          });
          if (originalImageList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { image: { disconnect: originalImageList } },
            });
          }
          await ctx.prisma.product.update({
            where: { id },
            data: { image: { create: image } },
          });
        }
        if (name) {
          let originalNameInfoList = originalproduct.name;
          let originalNameList: { id: number }[] = [];
          originalNameInfoList.forEach((eachName) => {
            originalNameList.push({ id: eachName.id });
          });
          if (originalNameList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { name: { disconnect: originalNameList } },
            });
          }
          await ctx.prisma.product.update({
            where: { id },
            data: { name: { create: name } },
          });
        }
        if (shops) {
          shops.forEach((eachShop: number) => {
            shopList.push({ id: eachShop });
          });
          let originalShopInfoList = originalproduct.shops;
          let originalShopList: { id: number }[] = [];
          originalShopInfoList.forEach((eachShop) => {
            originalShopList.push({ id: eachShop.id });
          });
          if (originalShopList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: {
                shops: { disconnect: originalShopList },
              },
            });
          }
          await ctx.prisma.product.update({
            where: { id },
            data: {
              shops: { connect: shopList },
            },
          });
        }
        try {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { description, instaText },
          });
        } catch (e) {
          console.log(e);
        }
      }
      return product ? product : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
