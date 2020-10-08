import { intArg, mutationField, stringArg } from "@nexus/schema";

export const createProduct = mutationField("createProduct", {
  type: "Boolean",
  args: {
    productName: stringArg({ required: true }),
    price: intArg({ required: true }),
    productImage: stringArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    externalLink: stringArg({ required: true }),
    tags: intArg({ list: true }),
    branchIds: intArg({ list: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        productName,
        price,
        productImage,
        description,
        externalLink,
        tags = [],
        branchIds = [],
      } = args;
      let tagList = await ctx.prisma.tag.findMany({
        where: { id: { in: tags } },
        select: { id: true },
      });
      let branchList = await ctx.prisma.branch.findMany({
        where: { id: { in: branchIds } },
        select: { id: true },
      });
      let queryResult = await ctx.prisma.product.create({
        data: {
          names: { create: { lang: "VI", word: productName } },
          price,
          images: { create: { url: productImage, order: 0 } },
          description,
          externalLink: {
            create: { url: externalLink, linkType: "OnlineShop", order: 1 },
          },
          tags: { connect: tagList },
          branches: { connect: branchList },
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
