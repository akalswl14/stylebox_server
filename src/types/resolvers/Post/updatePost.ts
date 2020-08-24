import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updatePost = mutationField("updatePost", {
  type: "Post",
  args: {
    id: intArg({ required: true }),
    title: stringArg({ nullable: true }),
    text: stringArg({ nullable: true }),
    images: arg({ type: "ImageInputType", list: true, nullable: true }),
    publisher: stringArg({ nullable: true }),
    products: arg({ type: "idDicInputType", list: true, nullable: true }),
    tags: arg({ type: "idDicInputType", list: true, nullable: true }),
    videos: arg({ type: "VideoInputType", list: true, nullable: true }),
    mainProductId: intArg({ nullable: true }),
  },
  nullable: true,
  description:
    "id argument is for Post ID and images argument is for PostImage.",
  resolve: async (_, args, ctx) => {
    try {
      let { id, text, title, publisher, images, products, tags } = args;
      let post, originalpost;
      try {
        originalpost = await ctx.prisma.post.findOne({
          where: { id },
          include: {
            tags: { select: { id: true } },
            images: { select: { id: true } },
            products: { select: { id: true } },
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalpost) {
        if (tags) {
          let originalTagList = originalpost.tags;
          if (originalTagList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { tags: { disconnect: originalTagList } },
            });
          }
          post = await ctx.prisma.post.update({
            where: { id },
            data: { tags: { connect: tags } },
          });
        }
        if (images) {
          let originalImageList = originalpost.images;
          if (originalImageList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { images: { disconnect: originalImageList } },
            });
          }
          post = await ctx.prisma.post.update({
            where: { id },
            data: { images: { create: images } },
          });
        }
        if (products) {
          let originalProductList = originalpost.products;
          if (originalProductList.length > 0) {
            await ctx.prisma.post.update({
              where: { id },
              data: { products: { disconnect: originalProductList } },
            });
          }
          post = await ctx.prisma.post.update({
            where: { id },
            data: { products: { connect: products } },
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
      return post ? post : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
