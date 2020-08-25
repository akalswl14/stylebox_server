import { stringArg, mutationField, arg, intArg } from "@nexus/schema";

export const createShop = mutationField("createShop", {
  type: "Shop",
  args: {
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
    "names argument is for ShopName, images argument is for ShopImage and videos argument is for ShopVideo.",
  resolve: async (_, args, ctx) => {
    try {
      const {
        names = [],
        externalLinks = [],
        logoUrl,
        description,
        images = [],
        videos = [],
        phoneNumber,
        tags = [],
      } = args;
      let shop;
      try {
        shop = await ctx.prisma.shop.create({
          data: {
            names: { create: names },
            externalLinks: { create: externalLinks },
            logoUrl,
            description,
            images: { create: images },
            videos: { create: videos },
            phoneNumber: { set: phoneNumber },
            tags: { connect: tags },
          },
        });
      } catch (e) {
        console.log(e);
      }
      return shop;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
