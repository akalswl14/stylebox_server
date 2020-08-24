import {
  intArg,
  mutationField,
  stringArg,
  arg,
  booleanArg,
} from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Product",
  args: {
    id: intArg({ required: true }),
    names: arg({ type: "NameInputType", nullable: true, list: true }),
    images: arg({ type: "ImageInputType", nullable: true, list: true }),
    branches: arg({ type: "idDicInputType", nullable: true, list: true }),
    tags: arg({ type: "idDicInputType", nullable: true, list: true }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
    price: intArg({ nullable: true }),
    externalLinks: arg({ type: "LinkInputType", nullable: true, list: true }),
    videos: arg({ type: "VideoInputType", nullable: true, list: true }),
    isOwnPost: booleanArg({ nullable: true }),
  },
  nullable: true,
  description: "id argument is for Product ID.",
  resolve: async (_, args, ctx) => {
    try {
      let {
        id,
        names,
        images,
        branches,
        tags,
        description,
        instaText,
        price,
        externalLinks,
        videos,
        isOwnPost,
      } = args;
      let product, originalproduct;
      try {
        originalproduct = await ctx.prisma.product.findOne({
          where: { id },
          select: {
            tags: { select: { id: true } },
            names: { select: { id: true } },
            images: { select: { id: true } },
            branches: { select: { id: true } },
            videos: { select: { id: true } },
            externalLinks: { select: { id: true } },
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalproduct) {
        if (tags) {
          let originalTagList = originalproduct.tags;
          if (originalTagList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { tags: { disconnect: originalTagList } },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: { tags: { connect: tags } },
          });
        }
        if (images) {
          let originalImageList = originalproduct.images;
          if (originalImageList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { images: { disconnect: originalImageList } },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: { images: { create: images } },
          });
        }
        if (videos) {
          let originalVideoList = originalproduct.videos;
          if (originalVideoList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { videos: { disconnect: originalVideoList } },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: { videos: { create: videos } },
          });
        }
        if (names) {
          let originalNameList = originalproduct.names;
          if (originalNameList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { names: { disconnect: originalNameList } },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: { names: { create: names } },
          });
        }
        if (branches) {
          let originalBranchList = originalproduct.branches;
          if (originalBranchList.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: {
                branches: { disconnect: originalBranchList },
              },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: {
              branches: { connect: branches },
            },
          });
        }
        if (externalLinks) {
          let originalexternalLinks = originalproduct.externalLinks;
          if (originalexternalLinks.length > 0) {
            await ctx.prisma.product.update({
              where: { id },
              data: { externalLinks: { disconnect: originalexternalLinks } },
            });
          }
          product = await ctx.prisma.product.update({
            where: { id },
            data: { externalLinks: { create: externalLinks } },
          });
        }
        try {
          product = await ctx.prisma.product.update({
            where: { id },
            data: { description, instaText, price, isOwnPost },
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
