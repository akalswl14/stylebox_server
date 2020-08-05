import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true, list: true }),
    shops: intArg({ list: true, nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    name: arg({ type: "productNameInputType", nullable: true, list: true }),
    image: arg({ type: "productImageInputType", nullable: true, list: true }),
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
          await ctx.prisma.product.update({
            where: { id },
            data: { image: { disconnect: originalImageList } },
          });
          image.forEach(async (eachImage: { url: string; order: number }) => {
            await ctx.prisma.productImage.create({
              data: {
                url: eachImage.url,
                order: eachImage.order,
                Product: { connect: { id } },
              },
            });
          });
        }
        if (name) {
          let originalNameInfoList = originalproduct.image;
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
          name.forEach(async (eachName: { lang: string; word: string }) => {
            await ctx.prisma.productName.create({
              data: {
                lang: eachName.lang,
                word: eachName.word,
                Product: { connect: { id } },
              },
            });
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
        if (instaText && instaText.length > 0) {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { instaText: { set: instaText } },
          });
        }
        try {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { description },
          });
        } catch (e) {
          console.log(e);
        }
      }
      if (product) {
        return product;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
