import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
    shops: intArg({ list: true, nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    name: arg({ type: "productNameInputType", nullable: true, list: true }),
    images: arg({ type: "productImageInputType", nullable: true, list: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let { id, description, instaText, shops, tags, name, images } = args;
      let product,
        originalproduct,
        tagList: { id: number }[] = [];
      if (tags) {
        tags.forEach((eachTag: number) => {
          tagList.push({ id: eachTag });
        });
      }
      try {
        originalproduct = await ctx.prisma.product.findOne({
          where: { id },
          include: { tags: true, name: true, images: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalproduct) {
        if (tags) {
          let originalTagInfoList = originalproduct.tags;
          let originalTagList: { id: number }[] = [];
          originalTagInfoList.forEach((eachTag) => {
            originalTagList.push({ id: eachTag.id });
          });
          await ctx.prisma.product.update({
            where: { id },
            data: { tags: { connect: tagList, disconnect: originalTagList } },
          });
        }
        if (images) {
          let originalImageInfoList = originalproduct.images;
          let originalImageList: { id: number }[] = [];
          originalImageInfoList.forEach((eachImage) => {
            originalImageList.push({ id: eachImage.id });
          });
          await ctx.prisma.product.update({
            where: { id },
            data: { images: { disconnect: originalImageList } },
          });
          images.forEach(async (eachImage: { url: string; order: number }) => {
            await ctx.prisma.productImage.create({
              data: {
                url: eachImage.url,
                order: eachImage.order,
                product: { connect: { id } },
              },
            });
          });
        }
        if (name) {
          let originalNameInfoList = originalproduct.images;
          let originalNameList: { id: number }[] = [];
          originalNameInfoList.forEach((eachName) => {
            originalNameList.push({ id: eachName.id });
          });
          console.log(originalNameList);
          await ctx.prisma.product.update({
            where: { id },
            data: { name: { disconnect: originalNameList } },
          });
          name.forEach(async (eachName: { lang: string; word: string }) => {
            await ctx.prisma.productName.create({
              data: {
                lang: eachName.lang,
                word: eachName.word,
                product: { connect: { id } },
              },
            });
          });
        }
        if (address) {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { address: { set: address } },
          });
        }
        try {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { discription, coordinate, city },
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
