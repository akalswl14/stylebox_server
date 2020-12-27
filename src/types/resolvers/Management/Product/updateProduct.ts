import {
  arg,
  booleanArg,
  intArg,
  mutationField,
  stringArg,
} from "@nexus/schema";

export const updateProduct = mutationField("updateProduct", {
  type: "Boolean",
  args: {
    productId: intArg({ required: true }),
    productName: stringArg({ nullable: true }),
    price: intArg({ nullable: true }),
    isProductImageChange: booleanArg({ required: true }),
    productImage: stringArg({ nullable: true }),
    isDescriptionChange: booleanArg({ required: true }),
    description: stringArg({ nullable: true }),
    externalLink: stringArg({ nullable: true }),
    tags: arg({ type: "IdOrderInputType", list: [true] }),
    branchIds: intArg({ list: [true], nullable: true }),
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
        externalLink,
        tags,
        branchIds,
      } = args;
      if (productName) {
        let nameResult = await ctx.prisma.productName.findMany({
          where: { productId, lang: "VI" },
          select: { id: true },
        });
        let queryResult = await ctx.prisma.productName.update({
          where: { id: nameResult[0].id },
          data: { word: productName, searchWord: productName.toLowerCase() },
        });
        if (!queryResult) return false;
      }
      if (isProductImageChange) {
        let deleteResult = await ctx.prisma.productImage.deleteMany({
          where: { productId },
        });
        if (productImage) {
          let queryResult = await ctx.prisma.productImage.create({
            data: {
              Product: { connect: { id: productId } },
              url: productImage,
              order: 1,
            },
          });
          if (!queryResult) return false;
        }
        if (!deleteResult) return false;
      }
      if (isDescriptionChange) {
        let queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { description },
        });
        if (!queryResult) return false;
      }
      if (tags) {
        let tagIdList: number[] = [],
          tagIdDicList: { id: number }[] = [];
        for (const eachTag of tags) {
          if (!eachTag.id) continue;
          tagIdList.push(eachTag.id);
          tagIdDicList.push({ id: eachTag.id });
        }
        let originalTags = await ctx.prisma.tag.findMany({
          where: { products: { some: { id: productId } } },
          select: { id: true },
        });
        const disconnectResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: {
            tags: { disconnect: originalTags },
          },
        });
        if (!disconnectResult) return false;
        const connectResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: {
            tags: { connect: tagIdDicList },
            onDetailTagId: { set: tagIdList },
          },
        });
        if (!connectResult) return false;
      }
      if (branchIds) {
        let originalBranches = await ctx.prisma.branch.findMany({
          where: { products: { some: { id: productId } } },
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
        let queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: { branches: { connect: branchList } },
        });
        if (!disconnectResult || !queryResult) return false;
      }
      if (externalLink) {
        let queryResult_find = await ctx.prisma.productExternalLink.findMany({
          where: { productId },
          select: { id: true, productId: true },
        });
        if (queryResult_find.length === 0 || !queryResult_find) return false;
        let queryResult_update = await ctx.prisma.productExternalLink.update({
          where: { id: queryResult_find[0].id },
          data: { url: externalLink },
        });
        if (!queryResult_update) return false;
      }
      if (price) {
        let queryResult = await ctx.prisma.product.update({
          where: { id: productId },
          data: {
            price,
          },
        });
        if (!queryResult) return false;
      }
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
});
