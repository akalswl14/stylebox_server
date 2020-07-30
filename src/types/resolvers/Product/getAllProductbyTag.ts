import { intArg, stringArg, mutationField, arg } from "@nexus/schema";

export const getAllProductbyTag = mutationField("getAllProductbyTag", {
  type: "Product",
  args: {
    tags: intArg({ list: true, required: true }),
    filter: stringArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tags, filter = "NEW" } = args;
      let products,
        tagList: { id: number }[] = [];
      try {
        if (tags) {
          tags.forEach((eachTag) => {
            tagList.push({ id: eachTag });
          });
        }
        if (filter == "RANK") {
          products = await ctx.prisma.product.findMany({
            where: { tags: { some: { OR: tagList } } },
          });
        } else {
          // filter == "NEW"
          products = await ctx.prisma.product.findMany({
            where: { tags: { some: { OR: tagList } } },
            include: { tags: true },
          });
        }
        console.log(products);
        return products;
      } catch (e) {
        console.log(e);
      }
      if (products) {
        return products;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
      return null;
    }
  },
});
