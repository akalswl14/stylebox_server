import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updatePost = mutationField("updatePost", {
  type: "Post",
  args: {
    id: intArg({ required: true }),
    text: stringArg({ nullable: true }),
    title: stringArg({ nullable: true }),
    publisher: stringArg({ nullable: true }),
    products: intArg({ nullable: true, list: true }),
    images: arg({ type: "ImageInputType", list: true, nullable: true }),
    tags: intArg({ list: true, nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      let { id, text, title, publisher, images, products, tags } = args;
      let post,
        originalpost,
        tagList: { id: number }[] = [],
        productList: { id: number }[] = [];
      try {
        originalpost = await ctx.prisma.post.findOne({
          where: { id },
          include: { tags: true, images: true, products: true },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalpost) {
        if (tags) {
          tags.forEach((eachTag: number) => {
            tagList.push({ id: eachTag });
          });
          let originalTagInfoList = originalpost.tags;
          let originalTagList: { id: number }[] = [];
          originalTagInfoList.forEach((eachTag) => {
            originalTagList.push({ id: eachTag.id });
          });
          if (originalTagList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { tags: { disconnect: originalTagList } },
            });
          }
          await ctx.prisma.post.update({
            where: { id },
            data: { tags: { connect: tagList } },
          });
        }
        if (images) {
          let originalImageInfoList = originalpost.images;
          let originalImageList: { id: number }[] = [];
          originalImageInfoList.forEach((eachImage) => {
            originalImageList.push({ id: eachImage.id });
          });
          if (originalImageList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { images: { disconnect: originalImageList } },
            });
          }
          await ctx.prisma.post.update({
            where: { id },
            data: { images: { create: images } },
          });
        }
        if (products) {
          products.forEach((eachProduct: number) => {
            productList.push({ id: eachProduct });
          });
          let originalProductInfoList = originalpost.products;
          let originalProductList: { id: number }[] = [];
          originalProductInfoList.forEach((eachProduct) => {
            originalProductList.push({ id: eachProduct.id });
          });
          if (originalProductList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { products: { disconnect: originalProductList } },
            });
          }
          await ctx.prisma.post.update({
            where: { id },
            data: { products: { connect: productList } },
          });
        }
        try {
          post = await ctx.prisma.post.update({
            where: { id },
            data: { text, title, publisher },
          });
        } catch (e) {
          console.log(e);
        }
      }
      if (post) {
        return post;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
