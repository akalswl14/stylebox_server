import { stringArg, mutationField, arg, intArg, floatArg } from "@nexus/schema";

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
    priority: floatArg({ nullable: true }),
    onShopListTagId: intArg({ nullable: true, list: true }),
    onDetailTagId: intArg({ nullable: true, list: true }),
    gotoshopLink: stringArg({ nullable: true }),
    shopNameTags: arg({ type: "NameInputType", list: true, required: true }),
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
        phoneNumber = [],
        tags = [],
        priority = 0.0,
        onShopListTagId = [],
        onDetailTagId = [],
        gotoshopLink,
        shopNameTags,
      } = args;
      let shop,
        monthlyRankScore = 0.0;
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
            priority,
            onShopListTagId: { set: onShopListTagId },
            onDetailTagId: { set: onDetailTagId },
            monthlyRankScore,
            gotoshopLink,
          },
        });
        if (shop) {
          let classResult = await ctx.prisma.class.create({
            data: {
              category: "ShopName",
              names: { create: shopNameTags },
            },
          });
          await ctx.prisma.tag.create({
            data: {
              names: { create: shopNameTags },
              isClass: true,
              category: "ShopName",
              isOnOption: false,
              Class: { connect: { id: classResult.id } },
              shops: { connect: { id: shop.id } },
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
      return shop ? shop : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
