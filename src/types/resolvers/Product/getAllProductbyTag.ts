import { intArg, stringArg, queryField } from "@nexus/schema";

export const getAllProductbyTag = queryField("getAllProductbyTag", {
  type: "Product",
  args: {
    tags: intArg({ list: true, required: true }),
    filter: stringArg({ nullable: true }),
    id: intArg({ nullable: true }),
  },
  nullable: true,
  list: true,
  resolve: async (_, args, ctx) => {
    try {
      const { tags, filter = "NEW", id } = args;
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
          if (id) {
            products = await ctx.prisma.product.findMany({
              where: { tags: { some: { OR: tagList } } },
              orderBy: { createdAt: "desc" },
              take: 4,
              cursor: { id },
              skip: 1,
            });
          } else {
            products = await ctx.prisma.product.findMany({
              where: { tags: { some: { OR: tagList } } },
              orderBy: { createdAt: "desc" },
              take: 4,
            });
          }
        }
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
