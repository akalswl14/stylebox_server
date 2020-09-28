import { booleanArg, intArg, mutationField, stringArg } from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Boolean",
  args: {
    productId: intArg({ required: true }),
    productName: stringArg({ nullable: true }),
    price: booleanArg({ nullable: true }),
    isProductImageChange: stringArg({ required: true }),
    productImage: stringArg({ nullable: true }),
    isDescriptionChange: stringArg({ required: true }),
    description: stringArg({ nullable: true }),
    tags: intArg({ list: true, nullable: true }),
    branchIds: intArg({ list: true, nullable: true }),
  },
  nullable: false,
  resolve: async (_, args, ctx) => {
    try {
      const {
        productId,
        productName,
        price,
        isProductImageChange,
        productImage,
        isDescriptionChange,
        description,
        tags,
        branchIds,
      } = args;
      let queryResult;
      if (productName) {
        let nameResult = await ctx.prisma.productName.findMany({
          where: { productId, lang: "VI" },
          select: { id: true },
        });
        queryResult = await ctx.prisma.productName.update({
          where: { id: nameResult[0].id },
          data: { word: productName },
        });
        if (!queryResult) return null;
      }
      if (isProductImageChange) {
        let deleteResult = await ctx.prisma.productImage.deleteMany({
          where: { productId },
        });
        queryResult = await ctx.prisma.productImage.create({
          data: {
            Product: { connect: { id: productId } },
            url: productImage,
            order: 1,
          },
        });
        if (!queryResult || !deleteResult) return null;
      }
      if (isDescriptionChange) {
        queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { description },
        });
        if (!queryResult) return null;
      }
      if (tags) {
        let originalTags = await ctx.prisma.tag.findMany({
          where: { products: { some: { id: productId } } },
          select: { id: true },
        });
        let disconnectResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { tags: { disconnect: originalTags } },
        });
        let tagList = await ctx.prisma.tag.findMany({
          where: { id: { in: tags } },
          select: { id: true },
        });
        queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { tags: { connect: tagList } },
        });
        if (!disconnectResult || !queryResult) return null;
      }
      if (branchIds) {
        let originalBranches = await ctx.prisma.branch.findMany({
          where: { products: { some: { id: { in: branchIds } } } },
          select: { id: true },
        });
        let disconnectResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { branches: { disconnect: originalBranches } },
        });
        let branchList = await ctx.prisma.branch.findMany({
          where: { id: { in: branchIds } },
          select: { id: true },
        });
        queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { branches: { connect: branchList } },
        });
        if (!disconnectResult || !queryResult) return null;
      }
      queryResult = await ctx.prisma.product.update({
        where: { id: productId },
        data: {
          price,
        },
      });
      return queryResult ? true : false;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
