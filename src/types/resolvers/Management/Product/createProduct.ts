import { arg, intArg, mutationField, stringArg } from "@nexus/schema";

export const createProduct = mutationField("createProduct", {
  type: "ProductIdInfo",
  args: {
    productName: stringArg({ required: true }),
    price: intArg({ required: true }),
    productImage: stringArg({ nullable: true }),
    description: stringArg({ nullable: true }),
    externalLink: stringArg({ required: true }),
    tags: arg({ type: "IdOrderInputType", list: [true] }),
    branchIds: intArg({ list: [true], nullable: true }),
  },
  nullable: true,
  resolve: async (_, args, ctx) => {
    try {
      const {
        productName,
        price,
        productImage,
        description,
        externalLink,
      } = args;
      const tags = args.tags ?? [];
      const branchIds = args.branchIds ?? [];
      let tagList: { id: number }[] = [],
        onDetailTagId: number[] = [];
      for (const eachTag of tags) {
        if (!eachTag.id) continue;
        tagList.push({ id: eachTag.id });
        onDetailTagId.push(eachTag.id);
      }
      let branchList = await ctx.prisma.branch.findMany({
        where: { id: { in: branchIds } },
        select: { id: true },
      });
      let queryResult = await ctx.prisma.product.create({
        data: {
          names: {
            create: {
              lang: "VI",
              word: productName,
              searchWord: productName.toLowerCase(),
            },
          },
          price,
          description,
          onDetailTagId: { set: onDetailTagId },
          branches: { connect: branchList },
        },
        select: { id: true },
      });
      if (!queryResult) return null;
      let tagConnectResult: any = true;
      tagConnectResult = await ctx.prisma.product.update({
        where: { id: queryResult.id },
        data: { tags: { connect: tagList } },
      });
      let imageResult: any = true;
      if (productImage) {
        imageResult = await ctx.prisma.productImage.create({
          data: {
            Product: { connect: { id: queryResult.id } },
            url: "Product/" + queryResult.id + "/" + productImage,
            order: 0,
          },
        });
      }
      let linkResult = await ctx.prisma.productExternalLink.create({
        data: {
          url: externalLink,
          linkType: "OnlineShop",
          order: 1,
          Product: { connect: { id: queryResult.id } },
        },
      });
      return queryResult && linkResult && imageResult && tagConnectResult
        ? { productId: queryResult.id }
        : null;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
