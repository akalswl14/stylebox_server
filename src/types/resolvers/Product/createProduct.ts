import { intArg, stringArg, mutationField, arg } from "@nexus/schema";

export const createProduct = mutationField("createProduct", {
  type: "Product",
  args: {
    shops: intArg({ required: true, list: true }),
    names: arg({ type: "NameInputType", list: true, required: true }),
    images: arg({ type: "ImageInputType", list: true, required: true }),
    tags: intArg({ list: true, nullable: true }),
    description: stringArg({ nullable: true }),
    instaText: stringArg({ nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        names,
        images,
        shops,
        tags = [],
        description = "",
        instaText = "",
      } = args;
      let product,
        tagList: { id: number }[] = [],
        shopList: { id: number }[] = [];
      try {
        if (tags) {
          tags.forEach((eachTag) => {
            tagList.push({ id: eachTag });
          });
        }
        shops.forEach((eachShop: number) => {
          shopList.push({ id: eachShop });
        });
        product = await ctx.prisma.product.create({
          data: {
            shops: { connect: shopList },
            tags: { connect: tagList },
            wishersCnt: 0,
            description,
            instaText,
            image: { create: images },
            name: { create: names },
          },
        });
      } catch (e) {
        console.log(e);
      }
      return product ? product : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
