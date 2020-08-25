import { intArg, mutationField, stringArg, arg } from "@nexus/schema";

export const updateShop = mutationField("updateShop", {
  type: "Shop",
  args: {
    id: intArg({ required: true }),
    names: arg({ type: "NameInputType", nullable: true, list: true }),
    externalLinks: arg({ type: "LinkInputType", list: true, required: false }),
    logoUrl: stringArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    images: arg({ type: "ImageInputType", nullable: true, list: true }),
    videos: arg({ type: "VideoInputType", nullable: true, list: true }),
    phoneNumber: stringArg({ nullable: true, list: true }),
    tags: arg({ type: "idDicInputType", list: true, nullable: true }),
  },
  nullable: true,
  description:
    "id argument is for Shop ID, name argument is for ShopName, images argument is for ShopImage and videos argument is for ShopVideo.",
  resolve: async (_, args, ctx) => {
    try {
      let {
        id,
        names,
        externalLinks,
        logoUrl,
        description,
        images,
        videos,
        phoneNumber,
        tags,
      } = args;
      let shop, originalShop;
      try {
        originalShop = await ctx.prisma.shop.findOne({
          where: { id },
          include: {
            tags: { select: { id: true } },
            names: { select: { id: true } },
            images: { select: { id: true } },
            videos: { select: { id: true } },
            externalLinks: { select: { id: true } },
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (originalShop) {
        if (tags) {
          let originalTagList = originalShop.tags;
          if (originalTagList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { tags: { disconnect: originalTagList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { tags: { connect: tags } },
          });
        }
        if (images) {
          let originalImageList = originalShop.images;
          if (originalImageList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { images: { delete: originalImageList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { images: { create: images } },
          });
        }
        if (videos) {
          let originalVideoList = originalShop.videos;
          if (originalVideoList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { videos: { delete: originalVideoList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { videos: { create: videos } },
          });
        }
        if (names) {
          let originalNameList = originalShop.names;
          if (originalNameList.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { names: { delete: originalNameList } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: { names: { create: names } },
          });
        }
        if (externalLinks) {
          let orginalexternalLinks = originalShop.names;
          if (orginalexternalLinks.length > 0) {
            await ctx.prisma.shop.update({
              where: { id },
              data: { externalLinks: { delete: orginalexternalLinks } },
            });
          }
          await ctx.prisma.shop.update({
            where: { id },
            data: {
              externalLinks: { create: externalLinks },
            },
          });
        }
        if (phoneNumber) {
          shop = await ctx.prisma.shop.update({
            where: { id },
            data: {
              phoneNumber: { set: phoneNumber },
            },
          });
        }
        try {
          shop = await ctx.prisma.shop.update({
            where: { id },
            data: { logoUrl, description },
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
