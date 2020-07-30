import { intArg, stringArg, mutationField, arg } from "@nexus/schema";

export const createProduct = mutationField("createProduct", {
  type: "Product",
  args: {
    shopId: intArg({ required: true }),
    names: arg({ type: "productNameInputType", list: true, required: true }),
    images: arg({ type: "productImageInputType", list: true, required: true }),
    tags: intArg({ list: true, nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const { names, images, shopId, tags = [] } = args;
      let product,
        tagList: { id: number }[] = [];
      try {
        if (tags) {
          tags.forEach((eachTag) => {
            tagList.push({ id: eachTag });
          });
        }
        product = await ctx.prisma.product.create({
          data: {
            Shop: { connect: { id: shopId } },
            tags: { connect: tagList },
          },
        });
      } catch (e) {
        console.log(e);
      }
      if (product) {
        const productId = product.id;
        images.forEach(async (eachImage) => {
          await ctx.prisma.productImage.create({
            data: {
              url: eachImage.url,
              order: eachImage.order,
              Product: { connect: { id: productId } },
            },
          });
        });
        names.forEach(async (eachName) => {
          await ctx.prisma.productName.create({
            data: {
              lang: eachName.lang,
              word: eachName.word,
              Product: { connect: { id: productId } },
            },
          });
        });
        product = await ctx.prisma.product.findOne({
          where: { id: productId },
        });
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
